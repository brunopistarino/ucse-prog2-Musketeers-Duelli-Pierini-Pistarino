package repositories

import (
	"api/model"
	"api/utils"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AlimentoRepositoryInterface interface {
	GetAlimentos() ([]model.Alimento, error)
	GetAlimentosBelowMinimum(foodType string, name string) ([]model.Alimento, error)
	SetAlimentosQuantityToMinimum(alimentos []model.Alimento) (float32, error)
	GetAlimento(id string) (model.Alimento, error)
	PostAlimento(alimento model.Alimento) (*mongo.InsertOneResult, error)
	PutAlimento(alimento model.Alimento) (*mongo.UpdateResult, error)
	DeleteAlimento(id primitive.ObjectID) (*mongo.DeleteResult, error)
}

type AlimentoRepository struct {
	db DB
}

func NewAlimentoRepository(db DB) *AlimentoRepository {
	return &AlimentoRepository{
		db: db,
	}
}

func (repository AlimentoRepository) GetAlimentos() ([]model.Alimento, error) {

	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	filter := bson.M{}

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var alimentos []model.Alimento
	for cursor.Next(context.Background()) {
		var alimento model.Alimento
		err := cursor.Decode(&alimento)
		if err != nil {
			return nil, err
		}
		alimentos = append(alimentos, alimento)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return alimentos, nil
}

func (repository AlimentoRepository) GetAlimentosBelowMinimum(foodType string, name string) ([]model.Alimento, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	filter := bson.M{"$expr": bson.M{"$lt": []string{"$cantidad_actual", "$cantidad_minima"}}}

	// Type filter by exact match and name filter by approximate match
	if foodType != "" {
		filter["tipo"] = foodType
	}
	if name != "" {
		filter["nombre"] = bson.M{"$regex": name, "$options": "i"}
	}

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var alimentos []model.Alimento
	for cursor.Next(context.Background()) {
		var alimento model.Alimento
		err := cursor.Decode(&alimento)
		if err != nil {
			return nil, err
		}
		alimentos = append(alimentos, alimento)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return alimentos, nil
}

func (repository AlimentoRepository) SetAlimentosQuantityToMinimum(alimentos []model.Alimento) (float32, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")

	var total float32

	// Set total to price of alimento times the difference between the minimum and actual quantity
	for _, alimento := range alimentos {

		total += alimento.Precio * float32(alimento.CantidadMinima-alimento.CantidadActual)
		filter := bson.M{"_id": alimento.ID}
		update := bson.M{"$set": bson.M{"cantidad_actual": alimento.CantidadMinima}}
		_, err := collection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			return 0, err
		}
	}

	return total, nil
}

func (repository AlimentoRepository) GetAlimento(id string) (model.Alimento, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	objectID := utils.GetObjectIDFromStringID(id)
	filter := bson.M{"_id": objectID}

	var alimento model.Alimento
	err := collection.FindOne(context.TODO(), filter).Decode(&alimento)
	if err != nil {
		return model.Alimento{}, err
	}

	return alimento, nil
}

func (repository AlimentoRepository) PostAlimento(alimento model.Alimento) (*mongo.InsertOneResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")

	result, err := collection.InsertOne(context.TODO(), alimento)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (repository AlimentoRepository) PutAlimento(alimento model.Alimento) (*mongo.UpdateResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")

	filter := bson.M{"_id": alimento.ID}
	update := bson.M{"$set": bson.M{"nombre": alimento.Nombre, "tipo": alimento.Tipo,
		"momentos": alimento.Momentos, "precio": alimento.Precio,
		"cantidad_actual":     alimento.CantidadActual,
		"cantidad_minima":     alimento.CantidadMinima,
		"fecha_actualizacion": alimento.FechaActualizacion}}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (repository AlimentoRepository) DeleteAlimento(id primitive.ObjectID) (*mongo.DeleteResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	filter := bson.M{"_id": id}

	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	return result, nil
}
