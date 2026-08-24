import clickhouse_connect
import os

def get_ch_client():
    return clickhouse_connect.get_client(
        host=os.getenv('CH_HOST', 'localhost'),
        port=int(os.getenv('CH_PORT', 8123)),
        username=os.getenv('CH_USER', 'clickhouse'),
        password=os.getenv('CH_PASSWORD', 'clickhouse'),
        database=os.getenv('CH_DB', 'sih_analytics')
    )

def init_clickhouse():
    client = clickhouse_connect.get_client(
        host=os.getenv('CH_HOST', 'localhost'),
        port=int(os.getenv('CH_PORT', 8123)),
        username=os.getenv('CH_USER', 'clickhouse'),
        password=os.getenv('CH_PASSWORD', 'clickhouse')
    )
    client.command("CREATE DATABASE IF NOT EXISTS sih_analytics")
    
    client = get_ch_client()
    
    # Using ReplacingMergeTree to ensure idempotency when running repeatedly
    client.command("""
        CREATE TABLE IF NOT EXISTS transactions (
            chain String,
            tx_hash String,
            block_time DateTime,
            from_address String,
            to_address String,
            amount Float64
        ) ENGINE = ReplacingMergeTree()
        ORDER BY (chain, tx_hash)
    """)
    client.command("""
        CREATE TABLE IF NOT EXISTS addresses (
            chain String,
            address String,
            first_seen DateTime,
            last_seen DateTime
        ) ENGINE = ReplacingMergeTree()
        ORDER BY (chain, address)
    """)
    print("ClickHouse tables initialized successfully.")
