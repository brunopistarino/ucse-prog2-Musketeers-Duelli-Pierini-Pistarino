package repositories

import (
	"api/model"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type CompraRepositoryInterface interface {
	PostCompra(compra model.Compra) (*mongo.InsertOneResult, error)
	GetCompras() ([]model.Compra, error)
}

type CompraRepository struct {
	db DB
}

func NewCompraRepository(db DB) *CompraRepository {
	return &CompraRepository{
		db: db,
	}
}

func (repository CompraRepository) PostCompra(compra model.Compra) (*mongo.InsertOneResult, error) {

	collection := repository.db.GetClient().Database("superCook").Collection("compras")

	result, err := collection.InsertOne(context.TODO(), compra)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (repository CompraRepository) GetCompras() ([]model.Compra, error) {

	collection := repository.db.GetClient().Database("superCook").Collection("compras")
	filter := bson.M{}

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var compras []model.Compra
	for cursor.Next(context.Background()) {
		var compra model.Compra
		err := cursor.Decode(&compra)
		if err != nil {
			return nil, err
		}
		compras = append(compras, compra)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return compras, nil
}
