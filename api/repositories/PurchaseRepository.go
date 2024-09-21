package repositories

import (
	"api/model"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type PurchaseRepositoryInterface interface {
	PostPurchase(purchase model.Purchase) (*mongo.InsertOneResult, error)
	GetPurchases(user string) ([]model.Purchase, error)
}

type PurchaseRepository struct {
	db DB
}

func NewPurchaseRepository(db DB) *PurchaseRepository {
	return &PurchaseRepository{
		db: db,
	}
}

func (repository PurchaseRepository) PostPurchase(purchase model.Purchase) (*mongo.InsertOneResult, error) {

	collection := repository.db.GetClient().Database("superCook").Collection("purchases")

	result, err := collection.InsertOne(context.TODO(), purchase)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (repository PurchaseRepository) GetPurchases(user string) ([]model.Purchase, error) {

	collection := repository.db.GetClient().Database("superCook").Collection("purchases")
	filter := bson.M{"user_code": user}
	findOptions := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := collection.Find(context.TODO(), filter, findOptions)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var purchases []model.Purchase
	for cursor.Next(context.Background()) {
		var purchase model.Purchase
		err := cursor.Decode(&purchase)
		if err != nil {
			return nil, err
		}
		purchases = append(purchases, purchase)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return purchases, nil
}
