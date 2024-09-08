package utils

import "go.mongodb.org/mongo-driver/bson/primitive"

func GetObjectIDFromStringID(id string) primitive.ObjectID {
	objectID, _ := primitive.ObjectIDFromHex(id)

	return objectID
}

func GetStringIDFromObjectID(id primitive.ObjectID) string {
	return id.Hex()
}
