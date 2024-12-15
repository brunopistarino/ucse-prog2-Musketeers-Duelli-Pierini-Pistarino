package repositories

import (
	"context"

	// CLUSTER
	/*
		"errors"
		"os"
	*/
	// CLUSTER

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDB struct {
	Client *mongo.Client
}

func NewMongoDB() *MongoDB {
	instancia := &MongoDB{}
	instancia.Connect()

	return instancia
}

func (mongoDB *MongoDB) GetClient() *mongo.Client {
	return mongoDB.Client
}

func (mongoDB *MongoDB) Connect() error {

	// CLUSTER
	/*
		clusterURL, exists := os.LookupEnv("DB_PROD")
		if !exists {
			return errors.New("DB_PROD environment variable not found")
		}
		clientOptions := options.Client().ApplyURI(clusterURL)
	*/
	// CLUSTER

	// LOCAL DOCKER-COMPOSE
	clientOptions := options.Client().ApplyURI("mongodb://db:27017")
	// LOCAL DOCKER-COMPOSE

	//LOCAL (DOCKERIZED)
	// clientOptions := options.Client().ApplyURI("mongodb://localhost:27110")
	//LOCAL (DOCKERIZED)

	//LOCAL
	// clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	//LOCAL

	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		return err
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		return err
	}

	mongoDB.Client = client

	return nil
}

func (mongoDB *MongoDB) Disconnect() error {
	return mongoDB.Client.Disconnect(context.Background())
}
