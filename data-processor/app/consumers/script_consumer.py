import json
import os
import redis
from confluent_kafka import Consumer, Producer, KafkaError

KAFKA_BROKER = os.environ.get("KAFKA_BROKER", "localhost:9092")
REDIS_ADDR = os.environ.get("REDIS_ADDR", "localhost:6379")
redis_host, redis_port = REDIS_ADDR.split(":") if ":" in REDIS_ADDR else (REDIS_ADDR, 6379)
cache = redis.Redis(host=redis_host, port=int(redis_port), decode_responses=True)

GROUP_ID = "script_processor_group"
TOPIC_IN = "script-execution"
TOPIC_OUT = "script-result" # Optional, if we want to push back via Kafka

def init_script_consumer():
    conf = {
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': GROUP_ID,
        'auto.offset.reset': 'earliest'
    }
    
    producer = Producer({'bootstrap.servers': KAFKA_BROKER})
    
    try:
        consumer = Consumer(conf)
        consumer.subscribe([TOPIC_IN])
        print(f"Data Processor listening to {TOPIC_IN}...")
        
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None: continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    print(msg.error())
                    continue
            
            val = msg.value().decode('utf-8')
            try:
                data = json.loads(val)
                script_id = data.get("id")
                code = data.get("code")
                cache_key = data.get("cacheKey")
                
                # Execute script
                result = execute_pandas_script(code)
                
                # Cache result in Redis
                if cache_key and result.get("status") == "success":
                    cache.setex(f"script_cache:{cache_key}", 3600, json.dumps(result))
                
                # Optionally publish result to a response topic
                response_event = json.dumps({"id": script_id, "result": result})
                producer.produce(TOPIC_OUT, key=str(script_id), value=response_event)
                producer.flush()
                
            except Exception as e:
                print(f"Error processing script message: {e}")
                
    finally:
        consumer.close()

if __name__ == "__main__":
    init_script_consumer()
