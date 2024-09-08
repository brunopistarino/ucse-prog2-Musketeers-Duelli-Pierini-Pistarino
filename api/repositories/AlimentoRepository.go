package repositories

import (
	"api/model"
	"api/utils"
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type AlimentoRepositoryInterface interface {
	GetAlimentos() ([]model.Alimento, error)
	GetAlimento(id string) (model.Alimento, error)
	PostAlimento(alimento model.Alimento) (*mongo.InsertOneResult, error)
	PutAlimento(alimento model.Alimento) (*mongo.UpdateResult, error)
	DeleteAlimento(id string) (*mongo.DeleteResult, error)
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
		log.Printf("[repository:AlimentoRepository][method:GetAlimentos][reason:FIND_ERROR][error:%d]", err)
		return nil, err
	}

	defer cursor.Close(context.Background())

	var alimentos []model.Alimento
	for cursor.Next(context.Background()) {
		var alimento model.Alimento
		err := cursor.Decode(&alimento)
		if err != nil {
			log.Printf("[repository:AlimentoRepository][method:GetAlimentos][reason:DECODE_ERROR][error:%d]", err)
			return nil, err
		}
		alimentos = append(alimentos, alimento)
	}

	if err := cursor.Err(); err != nil {
		log.Printf("[repository:AlimentoRepository][method:GetAlimentos][reason:ITERATION_ERROR][error:%d]", err)
		return nil, err
	}

	log.Printf("[repository:AlimentoRepository][method:GetAlimentos][reason:SUCCESS_GET][alimentos:%d]", len(alimentos))
	return alimentos, nil
}

func (repository AlimentoRepository) GetAlimento(id string) (model.Alimento, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	objectID := utils.GetObjectIDFromStringID(id)
	filter := bson.M{"_id": objectID}

	var alimento model.Alimento
	err := collection.FindOne(context.TODO(), filter).Decode(&alimento)
	if err != nil {
		log.Printf("[repository:AlimentoRepository][method:GetAlimento][reason:FIND_ERROR][error:%d]", err)
		return model.Alimento{}, err
	}

	log.Printf("[repository:AlimentoRepository][method:GetAlimento][reason:SUCCESS_GET][alimento:%s]", alimento.Nombre)
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
	update := bson.M{"$set": alimento}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (repository AlimentoRepository) DeleteAlimento(id string) (*mongo.DeleteResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("alimentos")
	objectID := utils.GetObjectIDFromStringID(id)
	filter := bson.M{"_id": objectID}

	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	return result, nil
}
