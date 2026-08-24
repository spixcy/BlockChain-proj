import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from db import init_clickhouse, get_ch_client
from adapters.bitcoin import fetch_btc_transactions
from adapters.tron import fetch_tron_transactions

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Default watchlist for MVP
WATCHLIST = {
    "bitcoin": ["1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"], # Satoshi's Genesis block address (always has txs)
    "tron": ["TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"] # Tether USDT contract on Tron
}

def ingest_data():
    logging.info("Starting ingestion cycle...")
    client = get_ch_client()
    
    for chain, addresses in WATCHLIST.items():
        for addr in addresses:
            logging.info(f"Fetching {chain} transactions for target: {addr}")
            
            try:
                if chain == "bitcoin":
                    txs = fetch_btc_transactions(addr)
                elif chain == "tron":
                    txs = fetch_tron_transactions(addr)
                else:
                    continue
                
                if txs:
                    # Insert transactions into ClickHouse
                    # Using row-oriented insertion
                    client.insert('transactions', [list(tx.values()) for tx in txs], column_names=list(txs[0].keys()))
                    logging.info(f"Successfully inserted {len(txs)} {chain} transactions for {addr}")
                else:
                    logging.info(f"No new transactions found for {addr}")
                    
            except Exception as e:
                logging.error(f"Error during {chain} ingestion for {addr}: {e}")

if __name__ == "__main__":
    init_clickhouse()
    scheduler = BlockingScheduler()
    
    # Run immediately on startup
    ingest_data()
    
    # Schedule to run every 10 minutes
    scheduler.add_job(ingest_data, 'interval', minutes=10)
    logging.info("APScheduler initialized. Waiting for next cycle...")
    scheduler.start()
