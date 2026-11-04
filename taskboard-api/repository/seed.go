package repository

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"taskboard-api/domain"
)

func SeedDemoTasks(db *mongo.Database) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	coll := db.Collection("demo_tasks")
	count, err := coll.EstimatedDocumentCount(ctx)
	if err != nil || count > 0 {
		return
	}

	demoJobs := []domain.Job{
		{
			ID:        bson.NewObjectID(),
			Title:     "Senior Frontend Engineer",
			Company:   "Agoda",
			Platform:  "LinkedIn",
			WorkType:  "On-site",
			Salary:    "85,000 - 130,000 THB",
			Location:  "CentralWorld, Bangkok",
			JobURL:    "https://careers.agoda.com",
			Status:    "interviewing",
			Due:       "18/11/2026",
			Desc:      "Technical interview with Engineering Lead covering React & System Design.",
			Notes:     "Review performance optimization and SSR patterns.",
			Starred:   true,
			CreatedAt: "01/11/2026",
		},
		{
			ID:        bson.NewObjectID(),
			Title:     "Golang Backend Developer",
			Company:   "LINE MAN Wongnai",
			Platform:  "JobsDB",
			WorkType:  "Hybrid",
			Salary:    "70,000 - 100,000 THB",
			Location:  "T-One Building, Bangkok",
			JobURL:    "https://careers.lmwn.com",
			Status:    "applied",
			Due:       "22/11/2026",
			Desc:      "Submitted resume and GitHub portfolio through company career site.",
			Notes:     "Team reaches out within 5 business days.",
			Starred:   true,
			CreatedAt: "02/11/2026",
		},
		{
			ID:        bson.NewObjectID(),
			Title:     "Full Stack Developer",
			Company:   "SCB TechX",
			Platform:  "JobThai",
			WorkType:  "Hybrid",
			Salary:    "75,000 - 95,000 THB",
			Location:  "SCB Park Plaza, Bangkok",
			JobURL:    "https://scbtechx.io",
			Status:    "accepted",
			Due:       "05/11/2026",
			Desc:      "Received official job offer with full benefits package.",
			Notes:     "Starting date confirmed for early next month.",
			Starred:   false,
			CreatedAt: "25/10/2026",
		},
		{
			ID:        bson.NewObjectID(),
			Title:     "Software Engineer (Platform)",
			Company:   "KBTG",
			Platform:  "LinkedIn",
			WorkType:  "Hybrid",
			Salary:    "65,000 - 90,000 THB",
			Location:  "Muang Thong Thani",
			JobURL:    "https://kbtg.tech",
			Status:    "bookmarked",
			Due:       "28/11/2026",
			Desc:      "Core platform team building microservices and developer tooling.",
			Notes:     "Prepare system architecture presentation.",
			Starred:   false,
			CreatedAt: "03/11/2026",
		},
		{
			ID:        bson.NewObjectID(),
			Title:     "Mobile Developer",
			Company:   "Bitkub",
			Platform:  "JobBKK",
			WorkType:  "Remote",
			Salary:    "60,000 - 80,000 THB",
			Location:  "Bangkok",
			JobURL:    "https://bitkub.com",
			Status:    "rejected",
			Due:       "29/10/2026",
			Desc:      "Position closed due to high applicant volume.",
			Notes:     "Keep in contact for future openings.",
			Starred:   false,
			CreatedAt: "20/10/2026",
		},
	}

	var docs []interface{}
	for _, job := range demoJobs {
		docs = append(docs, job)
	}
	_, _ = coll.InsertMany(ctx, docs)
}
