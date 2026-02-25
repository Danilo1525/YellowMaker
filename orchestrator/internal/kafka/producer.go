package kafka

import (
	"fmt"
	"os"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

var Producer *kafka.Producer

func InitProducer() {
	var err error
	broker := os.Getenv("KAFKA_BROKER")
	if broker == "" {
		broker = "localhost:9092"
	}

	Producer, err = kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": broker,
		"client.id":         "orchestrator",
		"acks":              "all",
	})

	if err != nil {
		fmt.Printf("Failed to create producer: %s\n", err)
		return
		// In production, we might want to panic or retry
	}

	fmt.Printf("Kafka Producer created on %s\n", broker)
}

func ProduceEvent(topic string, key string, value []byte) error {
	if Producer == nil {
		return fmt.Errorf("kafka producer not initialized")
	}

	deliveryChan := make(chan kafka.Event)
	err := Producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Key:            []byte(key),
		Value:          value,
	}, deliveryChan)

	if err != nil {
		return err
	}

	e := <-deliveryChan
	m := e.(*kafka.Message)

	if m.TopicPartition.Error != nil {
		return m.TopicPartition.Error
	}

	close(deliveryChan)
	return nil
}
