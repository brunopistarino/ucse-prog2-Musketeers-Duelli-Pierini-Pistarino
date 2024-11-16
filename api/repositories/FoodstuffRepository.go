package repositories

import (
	"api/dto"
	"api/model"
	"api/utils"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type FoodstuffRepositoryInterface interface {
	GetFoodstuff(user dto.User, id string) (model.Foodstuff, error)
	GetFoodstuffFromMealAndQuantity(user dto.User, meal string, foodstuff primitive.ObjectID, quantity int) (model.Foodstuff, error)
	GetFoodstuffs(user dto.User) ([]model.Foodstuff, error)
	GetFoodstuffsBelowMinimum(user dto.User, typeFoodstuff string, name string) ([]model.Foodstuff, error)
	SetFoodstuffsQuantityToMinimum(user dto.User, foodstuffs []model.Foodstuff) (float32, error)
	SetFoodstuffQuantityToValue(user dto.User, foodstuffValues []model.Ingredient) error
	CreateFoodstuff(foodstuff model.Foodstuff) (*mongo.InsertOneResult, error)
	UpdateFoodstuff(foodstuff model.Foodstuff) (*mongo.UpdateResult, error)
	DeleteFoodstuff(user dto.User, id primitive.ObjectID) (*mongo.DeleteResult, error)
}

type FoodstuffRepository struct {
	db DB
}

func NewFoodstuffRepository(db DB) *FoodstuffRepository {
	return &FoodstuffRepository{
		db: db,
	}
}

func (repository FoodstuffRepository) GetFoodstuffs(user dto.User) ([]model.Foodstuff, error) {

	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")
	filter := bson.M{"user_code": user}
	findOptions := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := collection.Find(context.TODO(), filter, findOptions)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var foodstuffs []model.Foodstuff
	for cursor.Next(context.Background()) {
		var foodstuff model.Foodstuff
		err := cursor.Decode(&foodstuff)
		if err != nil {
			return nil, err
		}
		foodstuffs = append(foodstuffs, foodstuff)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return foodstuffs, nil
}

func (repository FoodstuffRepository) GetFoodstuffsBelowMinimum(user dto.User, typeFoodstuff string, name string) ([]model.Foodstuff, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")
	userFilter := bson.M{"user_code": user}
	compareFilter := bson.M{"$expr": bson.M{"$lt": []string{"$current_quantity", "$minimum_quantity"}}}
	filter := bson.M{"$and": []bson.M{userFilter, compareFilter}}
	findOptions := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	if typeFoodstuff != "" {
		filter["type"] = typeFoodstuff
	}
	if name != "" {
		filter["name"] = bson.M{"$regex": name, "$options": "i"}
	}

	cursor, err := collection.Find(context.TODO(), filter, findOptions)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var foodstuffs []model.Foodstuff
	for cursor.Next(context.Background()) {
		var foodstuff model.Foodstuff
		err := cursor.Decode(&foodstuff)
		if err != nil {
			return nil, err
		}
		foodstuffs = append(foodstuffs, foodstuff)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return foodstuffs, nil
}

func (repository FoodstuffRepository) GetFoodstuffFromMealAndQuantity(user dto.User, meal string, foodstuff primitive.ObjectID, quantity int) (model.Foodstuff, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")
	userFilter := bson.M{"user_code": user}
	mealFilter := bson.M{"meals": meal}
	foodstuffFilter := bson.M{"_id": foodstuff}
	quantityFilter := bson.M{"current_quantity": bson.M{"$gte": quantity}}
	filter := bson.M{"$and": []bson.M{userFilter, mealFilter, foodstuffFilter, quantityFilter}}

	var foodstuffModel model.Foodstuff
	err := collection.FindOne(context.TODO(), filter).Decode(&foodstuffModel)
	if err != nil {
		return model.Foodstuff{}, err
	}
	return foodstuffModel, nil
}

func (repository FoodstuffRepository) SetFoodstuffsQuantityToMinimum(user dto.User, foodstuffs []model.Foodstuff) (float32, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")
	filterAdder := bson.M{"user_code": user}
	var total float32

	// Set total to price of foodstuff times the difference between the minimum and actual quantity
	for _, foodstuff := range foodstuffs {

		total += foodstuff.Price * float32(foodstuff.MinimumQuantity-foodstuff.CurrentQuantity)
		filterID := bson.M{"_id": foodstuff.ID}
		filter := bson.M{"$and": []bson.M{filterID, filterAdder}}
		update := bson.M{"$set": bson.M{"current_quantity": foodstuff.MinimumQuantity}}
		_, err := collection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			return 0, err
		}
	}

	return total, nil
}

func (repository FoodstuffRepository) SetFoodstuffQuantityToValue(user dto.User, foodstuffValues []model.Ingredient) error {
	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")
	filterAdder := bson.M{"user_code": user}

	for _, foodstuffValue := range foodstuffValues {
		filterID := bson.M{"_id": foodstuffValue.ID}
		filter := bson.M{"$and": []bson.M{filterID, filterAdder}}
		update := bson.M{"$inc": bson.M{"current_quantity": -foodstuffValue.Quantity}}
		_, err := collection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			return err
		}
	}

	return nil
}

func (repository FoodstuffRepository) GetFoodstuff(user dto.User, id string) (model.Foodstuff, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")
	objectID := utils.GetObjectIDFromStringID(id)
	userFilter := bson.M{"user_code": user}
	idFilter := bson.M{"_id": objectID}
	filter := bson.M{"$and": []bson.M{userFilter, idFilter}}

	var foodstuff model.Foodstuff
	err := collection.FindOne(context.TODO(), filter).Decode(&foodstuff)
	if err != nil {
		return model.Foodstuff{}, err
	}

	return foodstuff, nil
}

func (repository FoodstuffRepository) CreateFoodstuff(foodstuff model.Foodstuff) (*mongo.InsertOneResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")

	result, err := collection.InsertOne(context.TODO(), foodstuff)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (repository FoodstuffRepository) UpdateFoodstuff(foodstuff model.Foodstuff) (*mongo.UpdateResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")
	filterUser := bson.M{"user_code": foodstuff.UserCode}
	filterId := bson.M{"_id": foodstuff.ID}
	filter := bson.M{"$and": []bson.M{filterUser, filterId}}
	update := bson.M{"$set": bson.M{"name": foodstuff.Name, "type": foodstuff.Type,
		"meals": foodstuff.Meals, "price": foodstuff.Price,
		"current_quantity": foodstuff.CurrentQuantity,
		"minimum_quantity": foodstuff.MinimumQuantity,
		"created_at":       foodstuff.UpdatedAt}}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (repository FoodstuffRepository) DeleteFoodstuff(user dto.User, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("foodstuffs")
	userFilter := bson.M{"user_code": user}
	idFilter := bson.M{"_id": id}
	filter := bson.M{"$and": []bson.M{userFilter, idFilter}}

	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	return result, nil
}
