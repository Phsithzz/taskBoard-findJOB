package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
)


type Task struct{
	ID bson.ObjectID `bson:"_id,omitempty" json:"id" `
	Title string `bson:"title" json:"title"`
	Desc string `bson:"desc" json:"desc"`
	Due string `bson:"due" json:"due"`
	Status string `bson:"status" json:"status"`

}