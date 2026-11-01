package models 

type Task struct{
	ID int `json:"id"`
	Title string `json:"title"`
	Desc string `json:"desc"`
	Due string `json:"due"`
	Status string `json:"status"`

}