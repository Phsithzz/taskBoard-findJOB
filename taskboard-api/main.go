package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"taskboard-api/handlers"

	"github.com/gin-contrib/cors"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())


	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Taskboard API is alive"})
	})

	router.GET("/tasks", handlers.GetTasks)
	router.POST("/tasks",handlers.CreateTasks)
	router.PUT("/tasks/:id",handlers.UpdateTask)
	router.DELETE("/tasks/:id",handlers.DeleteTask)

	err := router.Run(":8080")
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
