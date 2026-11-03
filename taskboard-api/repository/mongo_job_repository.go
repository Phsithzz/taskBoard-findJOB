package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"taskboard-api/domain"
)

type mongoJobRepository struct {
	coll *mongo.Collection
}

func NewMongoJobRepository(db *mongo.Database) domain.JobRepository {
	return &mongoJobRepository{
		coll: db.Collection("tasks"),
	}
}

func (r *mongoJobRepository) FindAll(ctx context.Context) ([]domain.Job, error) {
	cur, err := r.coll.Find(ctx, bson.M{})
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
	_, err := r.coll.InsertOne(ctx, job)
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

	res, err := r.coll.UpdateOne(ctx, bson.M{"_id": objID}, update)
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

	res, err := r.coll.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil || res.DeletedCount == 0 {
		return false, err
	}
	return true, nil
}
