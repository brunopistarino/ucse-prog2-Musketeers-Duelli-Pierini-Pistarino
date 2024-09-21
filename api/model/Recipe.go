package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Recipe struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	UserCode    string             `bson:"user_code"`
	Name        string             `bson:"name"`
	Meal        string             `bson:"meal"`
	Ingredients []Ingredient       `bson:"ingredients"`
	CreatedAt   primitive.DateTime `bson:"created_at"`
	UpdatedAt   primitive.DateTime `bson:"updated_at"`
}

type Ingredient struct {
	ID       primitive.ObjectID `bson:"id"`
	Name     string             `bson:"name"`
	Quantity int                `bson:"quantity"`
}
