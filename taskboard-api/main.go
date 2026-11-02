package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"taskboard-api/handlers"
	"taskboard-api/store"
)

func main() {

	store.Connect()

	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Taskboard API is alive"})
	})

	router.GET("/tasks", handlers.GetTasks)
	router.POST("/tasks", handlers.CreateTasks)
	router.PUT("/tasks/:id", handlers.UpdateTask)
	router.DELETE("/tasks/:id", handlers.DeleteTask)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	err := router.Run(":" + port)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
