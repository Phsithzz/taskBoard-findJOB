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
