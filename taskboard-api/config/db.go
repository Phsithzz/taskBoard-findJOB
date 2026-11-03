package config

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func InitDB() *mongo.Database {
	_ = godotenv.Load(".env", "../.env")

	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "taskboard"
	}

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	if err := client.Ping(context.TODO(), nil); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	log.Printf("Connected to MongoDB at %s (db: %s)\n", uri, dbName)
	return client.Database(dbName)
}
