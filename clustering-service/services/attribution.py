import os
import psycopg2
from typing import List, Dict, Any, Tuple

def get_db_connection():
    db_url = os.getenv("DB_URL")
    if db_url:
        return psycopg2.connect(db_url)
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        port=os.getenv("DB_PORT", "5432"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "secretpassword"),
        dbname=os.getenv("DB_NAME", "sih_db")
    )

def attribute_cluster(reported_address: str, cluster: List[str], fund_flow_path: List[Dict[str, Any]]):
    # 1. Gather all unique addresses and their distance from the reported address
    distances = {reported_address: 0}
    
    for addr in cluster:
        if addr not in distances:
            distances[addr] = 0  # Same cluster = 0 hops logically
            
    for flow in fund_flow_path:
        to_addr = flow['to']
        hop = flow['hop']
        if to_addr not in distances or distances[to_addr] > hop:
            distances[to_addr] = hop

    if not distances:
        return None, "Low", "No addresses to attribute."

    # 2. Query VASP Registry
    addresses_to_query = list(distances.keys())
    tagged_entities = []
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = "SELECT address, entity_name, category, source, confidence FROM vasp_registry WHERE address = ANY(%s)"
        cur.execute(query, (addresses_to_query,))
        rows = cur.fetchall()
        
        for row in rows:
            tagged_entities.append({
                "address": row[0],
                "entity_name": row[1],
                "category": row[2],
                "source": row[3],
                "confidence": float(row[4])
            })
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error querying VASP registry: {e}")
        return None, "Unknown", f"Database error during attribution."

    if not tagged_entities:
        return None, "Low", "No known entities found in the cluster or traced hops. (Un-attributed)"

    # 3. Find the nearest VASP
    nearest_vasp = None
    min_hop = 999
    best_confidence = 0.0

    for entity in tagged_entities:
        addr = entity["address"]
        hop = distances.get(addr, 999)
        
        # Explainable confidence penalty: -0.1 per hop away from the target cluster
        adjusted_confidence = max(0.0, entity["confidence"] - (0.1 * hop))
        
        if hop < min_hop or (hop == min_hop and adjusted_confidence > best_confidence):
            nearest_vasp = entity
            min_hop = hop
            best_confidence = adjusted_confidence

    if not nearest_vasp:
        return None, "Low", "No entities successfully attributed."

    # 4. Determine Risk Tier & Reasoning (Rule-based)
    risk_tier = "Low"
    category = nearest_vasp["category"].lower()
    
    if category in ["mixer", "darknet", "sanctioned", "scam"]:
        risk_tier = "High"
        reasoning = f"{min_hop} hops to a known {category} ({nearest_vasp['entity_name']}). High risk of illicit fund obfuscation. (Base confidence: {nearest_vasp['confidence']}, Adjusted: {best_confidence:.2f})"
    elif min_hop == 0:
        if category == "exchange":
            risk_tier = "High"
            reasoning = f"Direct match to Exchange {nearest_vasp['entity_name']} (Deposit address). Potential immediate cash-out. (Confidence: {best_confidence:.2f})"
        else:
            risk_tier = "Medium"
            reasoning = f"Directly clustered with {nearest_vasp['entity_name']} ({category}). (Confidence: {best_confidence:.2f})"
    elif min_hop <= 2:
        risk_tier = "Medium"
        reasoning = f"Funds traced {min_hop} hops downstream to {nearest_vasp['entity_name']} ({category}). Adjusted confidence: {best_confidence:.2f}."
    else:
        risk_tier = "Low"
        reasoning = f"Found {nearest_vasp['entity_name']} at a distant {min_hop} hops. Risk diluted. Adjusted confidence: {best_confidence:.2f}."

    attribution_result = {
        "name": nearest_vasp["entity_name"],
        "confidence": round(best_confidence, 2),
        "source": nearest_vasp["source"],
        "category": nearest_vasp["category"]
    }

    return attribution_result, risk_tier, reasoning
