package repositories

import (
	"api/model"
	"api/utils"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AlimentoRepositoryInterface interface {
	GetAlimentos(user string) ([]model.Alimento, error)
	GetAlimentosBelowMinimum(user string, foodType string, name string) ([]model.Alimento, error)
	SetAlimentosQuantityToMinimum(user string, alimentos []model.Alimento) (float32, error)
	GetAlimento(user string, id string) (model.Alimento, error)
	PostAlimento(alimento model.Alimento) (*mongo.InsertOneResult, error)
	PutAlimento(alimento model.Alimento) (*mongo.UpdateResult, error)
	DeleteAlimento(user string, id primitive.ObjectID) (*mongo.DeleteResult, error)
}

type AlimentoRepository struct {
	db DB
}

func NewAlimentoRepository(db DB) *AlimentoRepository {
	return &AlimentoRepository{
		db: db,
	}
}

func (repository AlimentoRepository) GetAlimentos(user string) ([]model.Alimento, error) {

	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	filter := bson.M{"codigo_usuario": user}
	findOptions := options.Find().SetSort(bson.D{{Key: "fecha_creacion", Value: -1}})
	cursor, err := collection.Find(context.TODO(), filter, findOptions)
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

func (repository AlimentoRepository) GetAlimentosBelowMinimum(user string, foodType string, name string) ([]model.Alimento, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	userFilter := bson.M{"codigo_usuario": user}
	compareFilter := bson.M{"$expr": bson.M{"$lt": []string{"$cantidad_actual", "$cantidad_minima"}}}
	filter := bson.M{"$and": []bson.M{userFilter, compareFilter}}
	findOptions := options.Find().SetSort(bson.D{{Key: "fecha_creacion", Value: -1}})
	// Type filter by exact match and name filter by approximate match
	if foodType != "" {
		filter["tipo"] = foodType
	}
	if name != "" {
		filter["nombre"] = bson.M{"$regex": name, "$options": "i"}
	}

	cursor, err := collection.Find(context.TODO(), filter, findOptions)
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

func (repository AlimentoRepository) SetAlimentosQuantityToMinimum(user string, alimentos []model.Alimento) (float32, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	filterAdder := bson.M{"codigo_usuario": user}
	var total float32

	// Set total to price of alimento times the difference between the minimum and actual quantity
	for _, alimento := range alimentos {

		total += alimento.Precio * float32(alimento.CantidadMinima-alimento.CantidadActual)
		filterID := bson.M{"_id": alimento.ID}
		filter := bson.M{"$and": []bson.M{filterID, filterAdder}}
		update := bson.M{"$set": bson.M{"cantidad_actual": alimento.CantidadMinima}}
		_, err := collection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			return 0, err
		}
	}

	return total, nil
}

func (repository AlimentoRepository) GetAlimento(user string, id string) (model.Alimento, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	objectID := utils.GetObjectIDFromStringID(id)
	userFilter := bson.M{"codigo_usuario": user}
	idFilter := bson.M{"_id": objectID}
	filter := bson.M{"$and": []bson.M{userFilter, idFilter}}

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
	filterUser := bson.M{"codigo_usuario": alimento.CodigoUsuario}
	filterId := bson.M{"_id": alimento.ID}
	filter := bson.M{"$and": []bson.M{filterUser, filterId}}
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

func (repository AlimentoRepository) DeleteAlimento(user string, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	userFilter := bson.M{"codigo_usuario": user}
	idFilter := bson.M{"_id": id}
	filter := bson.M{"$and": []bson.M{userFilter, idFilter}}

	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	return result, nil
}
