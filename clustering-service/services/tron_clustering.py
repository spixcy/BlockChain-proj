import requests
import os
from typing import List, Set

def fetch_tron_txs(address: str):
    try:
        url = f"https://api.trongrid.io/v1/accounts/{address}/transactions/trc20"
        headers = {}
        api_key = os.getenv("TRONGRID_API_KEY")
        if api_key and api_key != "your_trongrid_key_here":
            headers["TRON-PRO-API-KEY"] = api_key
            
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            return resp.json().get('data', [])
    except Exception as e:
        print(f"Error fetching Tron txs: {e}")
    return []

def get_tron_cluster(address: str) -> List[str]:
    cluster: Set[str] = {address}
    txs = fetch_tron_txs(address)
    
    destinations = set()
    for tx in txs:
        if tx.get('from') == address:
            destinations.add(tx.get('to'))
            
    if len(destinations) == 1:
        cluster.update(destinations)

    return list(cluster)
