package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"taskboard-api/auth"
)

type AuthHandler struct {
	pinManager *auth.PinManager
}

func NewAuthHandler(pinManager *auth.PinManager) *AuthHandler {
	return &AuthHandler{pinManager: pinManager}
}

type verifyPinRequest struct {
	Pin string `json:"pin" binding:"required"`
}

func (h *AuthHandler) VerifyPin(c *gin.Context) {
	var req verifyPinRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PIN is required"})
		return
	}

	ip := c.ClientIP()
	valid, attemptsLeft, retryMinutes, isLocked := h.pinManager.Verify(ip, req.Pin)

	if isLocked {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error":               "Too many failed attempts. Access locked for 1 hour.",
			"locked":              true,
			"retry_after_minutes": retryMinutes,
		})
		return
	}

	if !valid {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":         "Invalid PIN",
			"attempts_left": attemptsLeft,
			"locked":        false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"mode":    "personal",
	})
}

func (h *AuthHandler) GetStatus(c *gin.Context) {
	ip := c.ClientIP()
	isLocked, retryMinutes := h.pinManager.CheckLockout(ip)

	c.JSON(http.StatusOK, gin.H{
		"locked":              isLocked,
		"retry_after_minutes": retryMinutes,
	})
}
