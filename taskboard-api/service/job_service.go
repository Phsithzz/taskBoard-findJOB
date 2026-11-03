package service

import (
	"context"
	"time"

	"taskboard-api/domain"
)

type jobService struct {
	repo domain.JobRepository
}

func NewJobService(repo domain.JobRepository) domain.JobService {
	return &jobService{repo: repo}
}

func (s *jobService) GetAllJobs(ctx context.Context) ([]domain.Job, error) {
	return s.repo.FindAll(ctx)
}

func (s *jobService) CreateJob(ctx context.Context, job domain.Job) (domain.Job, error) {
	if job.Status == "" {
		job.Status = "applied"
	}
	if job.Platform == "" {
		job.Platform = "LinkedIn"
	}
	if job.CreatedAt == "" {
		job.CreatedAt = time.Now().Format("02/01/2006")
	}
	return s.repo.Create(ctx, job)
}

func (s *jobService) UpdateJob(ctx context.Context, id string, job domain.Job) (domain.Job, bool, error) {
	return s.repo.Update(ctx, id, job)
}

func (s *jobService) DeleteJob(ctx context.Context, id string) (bool, error) {
	return s.repo.Delete(ctx, id)
}
