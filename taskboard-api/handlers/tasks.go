package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"taskboard-api/models"
	"taskboard-api/store"
)

func GetTasks(c *gin.Context) {
	c.JSON(http.StatusOK, store.All())
}

func CreateTasks(c *gin.Context) {
	var t models.Task

	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	created := store.Add(t)

	c.JSON(http.StatusCreated, created)
}

func UpdateTask(c *gin.Context) {
	var t models.Task

	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, ok := store.Update(c.Param("id"), t)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "task not found"})
		return
	}

	c.JSON(http.StatusOK, updated)
}

func DeleteTask(c *gin.Context) {
	id := c.Param("id")

	if !store.Delete(id) {
		c.JSON(http.StatusNotFound, gin.H{"error": "task not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "task deleted"})
}
