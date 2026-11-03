package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"taskboard-api/config"
	"taskboard-api/handlers"
	"taskboard-api/repository"
	"taskboard-api/service"
)

func main() {
	db := config.InitDB()

	jobRepo := repository.NewMongoJobRepository(db)
	jobService := service.NewJobService(jobRepo)
	jobHandler := handlers.NewJobHandler(jobService)

	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "JobHunt Tracker API is running"})
	})

	tasks := router.Group("/tasks")
	{
		tasks.GET("", jobHandler.GetJobs)
		tasks.POST("", jobHandler.CreateJob)
		tasks.PUT("/:id", jobHandler.UpdateJob)
		tasks.DELETE("/:id", jobHandler.DeleteJob)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	err := router.Run(":" + port)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
