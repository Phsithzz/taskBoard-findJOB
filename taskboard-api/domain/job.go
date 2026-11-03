package domain

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Job represents a job application entity in the domain layer
type Job struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string        `bson:"title" json:"title"`
	Company   string        `bson:"company" json:"company"`
	Platform  string        `bson:"platform" json:"platform"`
	WorkType  string        `bson:"work_type" json:"work_type"`
	Salary    string        `bson:"salary" json:"salary"`
	Location  string        `bson:"location" json:"location"`
	JobURL    string        `bson:"job_url" json:"job_url"`
	Status    string        `bson:"status" json:"status"`
	Due       string        `bson:"due" json:"due"`
	Desc      string        `bson:"desc" json:"desc"`
	Notes     string        `bson:"notes" json:"notes"`
	Starred   bool          `bson:"starred" json:"starred"`
	CreatedAt string        `bson:"created_at" json:"created_at"`
}

// JobRepository defines the interface for data access layer
type JobRepository interface {
	FindAll(ctx context.Context) ([]Job, error)
	Create(ctx context.Context, job Job) (Job, error)
	Update(ctx context.Context, id string, job Job) (Job, bool, error)
	Delete(ctx context.Context, id string) (bool, error)
}

// JobService defines the interface for business logic layer
type JobService interface {
	GetAllJobs(ctx context.Context) ([]Job, error)
	CreateJob(ctx context.Context, job Job) (Job, error)
	UpdateJob(ctx context.Context, id string, job Job) (Job, bool, error)
	DeleteJob(ctx context.Context, id string) (bool, error)
}
