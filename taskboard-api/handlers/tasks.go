package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"taskboard-api/store"
)

func GetTasks(c *gin.Context) {
	c.JSON(http.StatusOK, store.All())
}
