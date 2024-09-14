package repositories

import (
	"api/model"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CompraRepositoryInterface interface {
	PostCompra(compra model.Compra) (*mongo.InsertOneResult, error)
	GetCompras(user string) ([]model.Compra, error)
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

func (repository CompraRepository) GetCompras(user string) ([]model.Compra, error) {

	collection := repository.db.GetClient().Database("superCook").Collection("compras")
	filter := bson.M{"codigo_usuario": user}
	findOptions := options.Find().SetSort(bson.D{{Key: "fecha_creacion", Value: -1}})

	cursor, err := collection.Find(context.TODO(), filter, findOptions)
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
