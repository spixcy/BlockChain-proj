from services.bitcoin_clustering import fetch_btc_txs
from services.tron_clustering import fetch_tron_txs

def trace_hops(address: str, chain: str, max_hops: int = 2):
    paths = []
    current_layer = [address]
    visited = {address}
    
    for hop in range(1, max_hops + 1):
        next_layer = []
        for current_addr in current_layer:
            # Fetch txs based on chain
            txs = []
            if chain == 'bitcoin':
                txs = fetch_btc_txs(current_addr)
            elif chain == 'tron':
                txs = fetch_tron_txs(current_addr)
                
            # Process outgoing transactions (simplified for MVP: taking top 2 out txs to avoid fan-out explosion)
            out_txs = []
            if chain == 'bitcoin':
                for tx in txs:
                    is_sender = any(vin.get('prevout', {}).get('scriptpubkey_address') == current_addr for vin in tx.get('vin', []))
                    if is_sender:
                        for vout in tx.get('vout', []):
                            to_addr = vout.get('scriptpubkey_address')
                            if to_addr and to_addr != current_addr:
                                val = vout.get('value', 0) / 100000000.0
                                out_txs.append({"to": to_addr, "amount": val, "hash": tx.get('txid')})
            elif chain == 'tron':
                for tx in txs:
                    if tx.get('from') == current_addr:
                        to_addr = tx.get('to')
                        decimals = int(tx.get('token_info', {}).get('decimals', 6))
                        val = float(tx.get('value', 0)) / (10 ** decimals)
                        out_txs.append({"to": to_addr, "amount": val, "hash": tx.get('transaction_id')})
            
            # Sort by amount and take top 2 to trace
            out_txs.sort(key=lambda x: x['amount'], reverse=True)
            for out in out_txs[:2]:
                target = out['to']
                paths.append({
                    "from": current_addr,
                    "to": target,
                    "amount": out['amount'],
                    "tx_hash": out['hash'],
                    "hop": hop
                })
                if target not in visited:
                    visited.add(target)
                    next_layer.append(target)
                    
        current_layer = next_layer
        if not current_layer:
            break
            
    return paths
