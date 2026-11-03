package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"taskboard-api/domain"
)

type JobHandler struct {
	service domain.JobService
}

func NewJobHandler(service domain.JobService) *JobHandler {
	return &JobHandler{service: service}
}

func (h *JobHandler) GetJobs(c *gin.Context) {
	jobs, err := h.service.GetAllJobs(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, jobs)
}

func (h *JobHandler) CreateJob(c *gin.Context) {
	var job domain.Job
	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	created, err := h.service.CreateJob(c.Request.Context(), job)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

func (h *JobHandler) UpdateJob(c *gin.Context) {
	var job domain.Job
	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, ok, err := h.service.UpdateJob(c.Request.Context(), c.Param("id"), job)
	if err != nil || !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "job application not found"})
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (h *JobHandler) DeleteJob(c *gin.Context) {
	ok, err := h.service.DeleteJob(c.Request.Context(), c.Param("id"))
	if err != nil || !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "job application not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "job application deleted"})
}
