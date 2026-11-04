package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"taskboard-api/domain"
)

type mongoJobRepository struct {
	db *mongo.Database
}

func NewMongoJobRepository(db *mongo.Database) domain.JobRepository {
	return &mongoJobRepository{
		db: db,
	}
}

func (r *mongoJobRepository) getColl(ctx context.Context) *mongo.Collection {
	if collName, ok := ctx.Value(domain.CollectionContextKey).(string); ok && collName != "" {
		return r.db.Collection(collName)
	}
	return r.db.Collection("demo_tasks")
}

func (r *mongoJobRepository) FindAll(ctx context.Context) ([]domain.Job, error) {
	cur, err := r.getColl(ctx).Find(ctx, bson.M{})
	if err != nil {
		return []domain.Job{}, err
	}
	defer cur.Close(ctx)

	var jobs []domain.Job
	if err := cur.All(ctx, &jobs); err != nil {
		return []domain.Job{}, err
	}
	if jobs == nil {
		jobs = []domain.Job{}
	}
	return jobs, nil
}

func (r *mongoJobRepository) Create(ctx context.Context, job domain.Job) (domain.Job, error) {
	job.ID = bson.NewObjectID()
	_, err := r.getColl(ctx).InsertOne(ctx, job)
	if err != nil {
		return domain.Job{}, err
	}
	return job, nil
}

func (r *mongoJobRepository) Update(ctx context.Context, id string, job domain.Job) (domain.Job, bool, error) {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return domain.Job{}, false, err
	}

	update := bson.M{
		"$set": bson.M{
			"title":     job.Title,
			"company":   job.Company,
			"platform":  job.Platform,
			"work_type": job.WorkType,
			"salary":    job.Salary,
			"location":  job.Location,
			"job_url":   job.JobURL,
			"status":    job.Status,
			"due":       job.Due,
			"desc":      job.Desc,
			"notes":     job.Notes,
			"starred":   job.Starred,
		},
	}

	res, err := r.getColl(ctx).UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil || res.MatchedCount == 0 {
		return domain.Job{}, false, err
	}

	job.ID = objID
	return job, true, nil
}

func (r *mongoJobRepository) Delete(ctx context.Context, id string) (bool, error) {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return false, err
	}

	res, err := r.getColl(ctx).DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil || res.DeletedCount == 0 {
		return false, err
	}
	return true, nil
}
