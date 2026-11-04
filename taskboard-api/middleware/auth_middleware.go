package middleware

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"

	"taskboard-api/auth"
	"taskboard-api/domain"
)

func ResolveWorkspace(pinManager *auth.PinManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		pin := c.GetHeader("X-Access-PIN")
		if pin == "" {
			ctx := context.WithValue(c.Request.Context(), domain.CollectionContextKey, "demo_tasks")
			c.Request = c.Request.WithContext(ctx)
			c.Next()
			return
		}

		ip := c.ClientIP()
		valid, attemptsLeft, retryMinutes, isLocked := pinManager.Verify(ip, pin)

		if isLocked {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":               "Access locked for 1 hour due to 3 failed attempts.",
				"locked":              true,
				"retry_after_minutes": retryMinutes,
			})
			return
		}

		if !valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error":         "Invalid PIN",
				"attempts_left": attemptsLeft,
				"locked":        false,
			})
			return
		}

		ctx := context.WithValue(c.Request.Context(), domain.CollectionContextKey, "tasks")
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}
