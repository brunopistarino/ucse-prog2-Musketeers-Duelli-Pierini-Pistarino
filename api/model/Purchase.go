package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Purchase struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UserCode  string             `bson:"user_code"`
	TotalCost float32            `bson:"total_cost"`
	CreatedAt primitive.DateTime `bson:"created_at"`
	UpdatedAt primitive.DateTime `bson:"updated_at"`
}
