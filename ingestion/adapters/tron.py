import requests
import os
from datetime import datetime

def fetch_tron_transactions(address: str):
    url = f"https://api.trongrid.io/v1/accounts/{address}/transactions/trc20"
    headers = {}
    api_key = os.getenv("TRONGRID_API_KEY")
    if api_key and api_key != "your_trongrid_key_here":
        headers["TRON-PRO-API-KEY"] = api_key
        
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print(f"Error fetching Tron for {address}: {resp.status_code}")
        return []
    
    data = resp.json().get('data', [])
    results = []
    for tx in data:
        tx_hash = tx.get('transaction_id')
        block_time = datetime.fromtimestamp(int(tx.get('block_timestamp', 0)) / 1000.0)
        from_addr = tx.get('from')
        to_addr = tx.get('to')
        decimals = int(tx.get('token_info', {}).get('decimals', 6))
        amount = float(tx.get('value', 0)) / (10 ** decimals)
        
        results.append({
            "chain": "tron",
            "tx_hash": tx_hash,
            "block_time": block_time,
            "from_address": from_addr,
            "to_address": to_addr,
            "amount": amount
        })
    return results
