package repositories

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type DB interface {
	Connect() error
	Disconnect() error
	GetClient() *mongo.Client
}
