import requests
from datetime import datetime

def fetch_btc_transactions(address: str):
    # Using Blockstream's free API
    url = f"https://blockstream.info/api/address/{address}/txs"
    resp = requests.get(url)
    if resp.status_code != 200:
        print(f"Error fetching BTC for {address}: {resp.status_code}")
        return []
    
    txs = resp.json()
    results = []
    for tx in txs:
        tx_hash = tx.get('txid')
        block_time = datetime.fromtimestamp(tx.get('status', {}).get('block_time', int(datetime.now().timestamp())))
        
        # Determine from_address (just use the first input for simplicity in MVP)
        from_addr = "unknown"
        if tx.get('vin') and tx['vin'][0].get('prevout'):
            from_addr = tx['vin'][0]['prevout'].get('scriptpubkey_address', 'unknown')
        
        # Determine to_address and amount
        to_addr = None
        amount = 0.0
        
        # Look for output that matches our tracked address
        for vout in tx.get('vout', []):
            if vout.get('scriptpubkey_address') == address:
                to_addr = address
                amount = vout.get('value', 0) / 100000000.0
                break
        
        # If not, just grab the first output
        if not to_addr and tx.get('vout'):
            to_addr = tx['vout'][0].get('scriptpubkey_address', "unknown")
            amount = tx['vout'][0].get('value', 0) / 100000000.0
            
        results.append({
            "chain": "bitcoin",
            "tx_hash": tx_hash,
            "block_time": block_time,
            "from_address": from_addr,
            "to_address": to_addr,
            "amount": amount
        })
    return results
