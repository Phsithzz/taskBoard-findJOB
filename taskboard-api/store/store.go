package store

import "taskboard-api/models"

var tasks = []models.Task{
	{
		ID:1,
		Title: "Tall",
		Desc: "Tall detail",
		Due: "1 Nov",
		Status: "Plan",
	},
	{
		ID:2,
		Title: "Short",
		Desc: "Short detail",
		Due: "2 Nov",
		Status: "Pending",
	},
}

func All() []models.Task{
	return tasks
}