package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Task struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string        `bson:"title" json:"title"`               // ตำแหน่งงาน (Position / Role)
	Company     string        `bson:"company" json:"company"`           // ชื่อบริษัท
	Platform    string        `bson:"platform" json:"platform"`         // LinkedIn, JobsDB, JobBKK, JobThai, etc.
	WorkType    string        `bson:"work_type" json:"work_type"`       // Remote, Hybrid, Onsite
	Salary      string        `bson:"salary" json:"salary"`             // เงินเดือน เช่น 30k - 45k
	Location    string        `bson:"location" json:"location"`         // สถานที่ / ทำเล เช่น BTS อโศก
	JobURL      string        `bson:"job_url" json:"job_url"`           // ลิงก์ประกาศงาน
	Status      string        `bson:"status" json:"status"`             // bookmarked, applied, interviewing, accepted, rejected
	Due         string        `bson:"due" json:"due"`                   // วันที่นัดสัมภาษณ์ / กำหนดส่ง
	Desc        string        `bson:"desc" json:"desc"`                 // รายละเอียดงาน / Requirement
	Notes       string        `bson:"notes" json:"notes"`               // โน้ตสัมภาษณ์ / ข้อมูลบริษัท
	Starred     bool          `bson:"starred" json:"starred"`           // ติดดาวบริษัทสำคัญ
	CreatedAt   string        `bson:"created_at" json:"created_at"`     // วันที่บันทึก
}
