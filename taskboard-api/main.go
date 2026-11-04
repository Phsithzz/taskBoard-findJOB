package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"taskboard-api/auth"
	"taskboard-api/config"
	"taskboard-api/handlers"
	"taskboard-api/middleware"
	"taskboard-api/repository"
	"taskboard-api/service"
)

func main() {
	db := config.InitDB()
	repository.SeedDemoTasks(db)

	pinManager := auth.NewPinManager()

	jobRepo := repository.NewMongoJobRepository(db)
	jobService := service.NewJobService(jobRepo)
	jobHandler := handlers.NewJobHandler(jobService)
	authHandler := handlers.NewAuthHandler(pinManager)

	router := gin.Default()

	allowedOrigins := []string{
		"https://task-board-find-job.vercel.app",
		"http://localhost:5173",
		"http://localhost:3000",
	}
	if envOrigin := os.Getenv("FRONTEND_URL"); envOrigin != "" {
		allowedOrigins = append(allowedOrigins, envOrigin)
	}

	corsConfig := cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Accept", "Authorization", "X-Requested-With", "X-Access-PIN"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(corsConfig))

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "JobHunt Tracker API is running"})
	})

	authGroup := router.Group("/auth")
	{
		authGroup.POST("/verify", authHandler.VerifyPin)
		authGroup.GET("/status", authHandler.GetStatus)
	}

	tasks := router.Group("/tasks")
	tasks.Use(middleware.ResolveWorkspace(pinManager))
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
