package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func InitDB() *mongo.Database {
	_ = godotenv.Load(".env", "../.env")

	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Println("[WARN] MONGO_URI is not set! Defaulting to mongodb://localhost:27017")
		uri = "mongodb://localhost:27017"
	} else {
		log.Println("[INFO] MONGO_URI detected, connecting to MongoDB Atlas...")
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "taskboard"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("[ERROR] Failed to connect to MongoDB: %v", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("[ERROR] Failed to ping MongoDB: %v", err)
	}

	log.Printf("[INFO] Successfully connected to MongoDB database: %s\n", dbName)
	return client.Database(dbName)
}
