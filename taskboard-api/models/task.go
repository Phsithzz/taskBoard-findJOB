package models 

import "go.mongodb.org/mongo-driver/bson/primitive"


type Task struct{
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id" `
	Title string `bson:"title" json:"title"`
	Desc string `bson:"desc" json:"desc"`
	Due string `bson:"due" json:"due"`
	Status string `bson:"status" json:"status"`

}