package store

import (
	"strconv"
	"taskboard-api/models"
)

var tasks = []models.Task{
	{
		ID:     1,
		Title:  "Tall",
		Desc:   "Tall detail",
		Due:    "1 Nov",
		Status: "Plan",
	},
	{
		ID:     2,
		Title:  "Short",
		Desc:   "Short detail",
		Due:    "2 Nov",
		Status: "Pending",
	},
}

func All() []models.Task {
	return tasks
}

func Add(t models.Task) models.Task {
	if t.Status == "" {
		t.Status = "planned"
	}

	t.ID = len(tasks) + 1

	tasks = append(tasks, t)

	return t
}

func Update(id string, t models.Task) (models.Task, bool) {
	n, err := strconv.Atoi(id)
	if err != nil {
		return models.Task{}, false
	}

	for i, existing := range tasks {
		if existing.ID == n {
			t.ID = n
			tasks[i] = t
			return t, true
		}
	}

	return models.Task{}, false
}

func Delete(id string) bool {
	n, err := strconv.Atoi(id)
	if err != nil {
		return false
	}

	for i, existing := range tasks {
		if existing.ID == n {
			tasks = append(tasks[:i], tasks[i+1:]...)
			return true
		}
	}
	return false
}
