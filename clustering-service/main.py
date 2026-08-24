from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from services.bitcoin_clustering import get_bitcoin_cluster
from services.tron_clustering import get_tron_cluster
from services.hop_tracing import trace_hops
from services.attribution import attribute_cluster

app = FastAPI(title="Clustering & Attribution Service")

from routers.mock_integrations import router as mock_router
app.include_router(mock_router)


class ClusterRequest(BaseModel):
    wallet_address: str
    chain: str

class VaspInfo(BaseModel):
    name: str
    confidence: float
    source: str
    category: str

class ClusterResponse(BaseModel):
    reported_address: str
    chain: str
    cluster: List[str]
    hops_traced: int
    nearest_vasp: Optional[VaspInfo] = None
    risk_tier: str
    reasoning: str
    fund_flow_path: List[Dict[str, Any]]

@app.get("/health")
def health_check():
    return {"status": "UP"}

@app.post("/cluster", response_model=ClusterResponse)
def cluster_address(req: ClusterRequest):
    chain = req.chain.lower()
    address = req.wallet_address
    
    if chain not in ["bitcoin", "tron"]:
        raise HTTPException(status_code=400, detail="Unsupported chain. Use 'bitcoin' or 'tron'.")
        
    # 1. Generate Cluster
    cluster = []
    if chain == "bitcoin":
        cluster = get_bitcoin_cluster(address)
    elif chain == "tron":
        cluster = get_tron_cluster(address)
        
    # 2. Trace Hops
    paths = trace_hops(address, chain, max_hops=2)
    
    # 3. Attribute and Score Risk
    nearest_vasp, risk_tier, reasoning = attribute_cluster(address, cluster, paths)
    
    return {
        "reported_address": address,
        "chain": chain,
        "cluster": cluster,
        "hops_traced": 2 if paths else 0,
        "nearest_vasp": nearest_vasp,
        "risk_tier": risk_tier,
        "reasoning": reasoning,
        "fund_flow_path": paths
    }

# Also expose a direct /attribute endpoint as requested
@app.post("/attribute", response_model=ClusterResponse)
def attribute_address(req: ClusterRequest):
    return cluster_address(req)

