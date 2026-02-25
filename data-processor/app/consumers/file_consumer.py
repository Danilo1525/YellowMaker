import json
import os
from confluent_kafka import Consumer, KafkaError

KAFKA_BROKER = os.environ.get("KAFKA_BROKER", "localhost:9092")
GROUP_ID = "data_processor_group"
TOPIC = "file-upload"

def init_consumer():
    conf = {
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': GROUP_ID,
        'auto.offset.reset': 'earliest'
    }
    
    try:
        consumer = Consumer(conf)
        consumer.subscribe([TOPIC])
        print(f"Data Processor listening to {TOPIC} on {KAFKA_BROKER}...")
        
        while True:
            msg = consumer.poll(timeout=1.0)
            
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    print(msg.error())
                    break
            
            # Message properly received
            val = msg.value().decode('utf-8')
            print(f"Received file upload event: {val}")
            
            try:
                data = json.loads(val)
                filepath = data.get("filepath")
                # Here we would trigger processing of the file using Pandas/DuckDB
                process_file(filepath)
            except Exception as e:
                print(f"Error processing message: {e}")
                
    finally:
        consumer.close()

def process_file(filepath):
    print(f"Processing file: {filepath}")
    if os.path.exists(filepath):
        print("File found. Ready for pandas/duckdb engine.")
    else:
        print("File not found.")

if __name__ == "__main__":
    init_consumer()
