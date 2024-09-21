package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Foodstuff struct {
	ID              primitive.ObjectID `bson:"_id,omitempty"`
	UserCode        string             `bson:"user_code"`
	Name            string             `bson:"name"`
	Type            string             `bson:"type"`
	Meals           []string           `bson:"meals"`
	Price           float32            `bson:"price"`
	CurrentQuantity int                `bson:"current_quantity"`
	MinimumQuantity int                `bson:"minimum_quantity"`
	CreatedAt       primitive.DateTime `bson:"created_at"`
	UpdatedAt       primitive.DateTime `bson:"updated_at"`
}
