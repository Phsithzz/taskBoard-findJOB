package store

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"

	"taskboard-api/models"
)

var coll *mongo.Collection

func Connect() {
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

	coll = client.Database(dbName).Collection("tasks")
	log.Printf("Connected to MongoDB at %s (db: %s)\n", uri, dbName)
}

func All() []models.Task {
	cur, err := coll.Find(context.TODO(), bson.M{})
	if err != nil {
		return []models.Task{}
	}
	defer cur.Close(context.TODO())

	var tasks []models.Task
	if err := cur.All(context.TODO(), &tasks); err != nil {
		return []models.Task{}
	}

	if tasks == nil {
		tasks = []models.Task{}
	}

	return tasks
}

func Add(t models.Task) (models.Task, error) {
	if t.Status == "" {
		t.Status = "planned"
	}
	t.ID = bson.NewObjectID()

	_, err := coll.InsertOne(context.TODO(), t)
	if err != nil {
		return models.Task{}, err
	}

	return t, nil
}

func Update(id string, t models.Task) (models.Task, bool) {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return models.Task{}, false
	}

	update := bson.M{
		"$set": bson.M{
			"title":  t.Title,
			"desc":   t.Desc,
			"due":    t.Due,
			"status": t.Status,
		},
	}

	res, err := coll.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)
	if err != nil || res.MatchedCount == 0 {
		return models.Task{}, false
	}

	t.ID = objID
	return t, true
}

func Delete(id string) bool {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return false
	}

	res, err := coll.DeleteOne(context.TODO(), bson.M{"_id": objID})
	if err != nil || res.DeletedCount == 0 {
		return false
	}

	return true
}
