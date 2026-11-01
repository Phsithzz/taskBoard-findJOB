package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"taskboard-api/handlers"
)

func main() {
	router := gin.Default()

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Taskboard API is alive"})
	})

	router.GET("/tasks", handlers.GetTasks)

	err := router.Run(":8080")
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
