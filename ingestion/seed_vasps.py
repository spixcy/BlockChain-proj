import psycopg2
import os
import logging
import time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def seed_vasps():
    # Adding retry logic so the container can wait for postgres to be ready
    max_retries = 5
    for attempt in range(max_retries):
        try:
            conn = psycopg2.connect(
                host=os.getenv('DB_HOST', 'postgres'),
                port=os.getenv('DB_PORT', '5432'),
                user=os.getenv('DB_USER', 'postgres'),
                password=os.getenv('DB_PASSWORD', 'secretpassword'),
                dbname=os.getenv('DB_NAME', 'sih_db')
            )
            cur = conn.cursor()
            logging.info("Connected to PostgreSQL for VASP seeding.")
            break
        except Exception as e:
            logging.warning(f"Postgres not ready, retrying ({attempt+1}/{max_retries})...")
            time.sleep(5)
    else:
        logging.error("Could not connect to PostgreSQL to seed VASPs.")
        return
        
    cur.execute("""
        CREATE TABLE IF NOT EXISTS vasp_registry (
            id SERIAL PRIMARY KEY,
            address VARCHAR(255) UNIQUE,
            entity_name VARCHAR(255),
            category VARCHAR(255),
            source VARCHAR(255),
            confidence FLOAT
        )
    """)
    
    # Mock GraphSense TagPack Data
    demo_vasps = [
        ('1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s', 'Binance', 'exchange', 'GraphSense TagPack', 0.99),
        ('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', 'Tether Contract', 'smart_contract', 'GraphSense TagPack', 1.0),
        ('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'Satoshi (Mixer proxy demo)', 'mixer', 'GraphSense TagPack', 0.95),
        ('TJdfjP8dM9Kz8G13J3wA4m8Y98b4Y83wP', 'Huobi', 'exchange', 'GraphSense TagPack', 0.90)
    ]
    
    for vasp in demo_vasps:
        cur.execute("""
            INSERT INTO vasp_registry (address, entity_name, category, source, confidence)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (address) DO NOTHING
        """, vasp)
    
    conn.commit()
    cur.close()
    conn.close()
    logging.info("VASP Registry successfully seeded with GraphSense mock TagPacks.")

if __name__ == "__main__":
    seed_vasps()
