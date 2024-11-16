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

type RecipeRepositoryInterface interface {
	GetRecipes(user dto.User, name string, meal string) ([]model.Recipe, error)
	GetRecipe(user dto.User, id string) (model.Recipe, error)
	CreateRecipe(recipe model.Recipe) (*mongo.InsertOneResult, error)
	DeleteRecipe(user dto.User, id primitive.ObjectID) (*mongo.DeleteResult, error)
}

type RecipeRepository struct {
	db DB
}

func NewRecipeRepository(db DB) *RecipeRepository {
	return &RecipeRepository{
		db: db,
	}
}

func (repository RecipeRepository) GetRecipes(user dto.User, name string, meal string) ([]model.Recipe, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("recipes")
	filter := bson.M{"user_code": user}
	findOptions := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	if name != "" {
		filter["name"] = bson.M{"$regex": name, "$options": "i"}
	}
	if meal != "" {
		filter["meal"] = meal
	}

	cursor, err := collection.Find(context.TODO(), filter, findOptions)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var recipes []model.Recipe
	for cursor.Next(context.Background()) {
		var recipe model.Recipe
		err := cursor.Decode(&recipe)
		if err != nil {
			return nil, err
		}
		recipes = append(recipes, recipe)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return recipes, nil
}

func (repository RecipeRepository) GetRecipe(user dto.User, id string) (model.Recipe, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("recipes")
	objectID := utils.GetObjectIDFromStringID(id)
	filter := bson.M{"user_code": user, "_id": objectID}

	var recipe model.Recipe
	err := collection.FindOne(context.Background(), filter).Decode(&recipe)
	if err != nil {
		return model.Recipe{}, err
	}

	return recipe, nil
}

func (repository RecipeRepository) CreateRecipe(recipe model.Recipe) (*mongo.InsertOneResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("recipes")

	result, err := collection.InsertOne(context.TODO(), recipe)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (repository RecipeRepository) DeleteRecipe(user dto.User, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	collection := repository.db.GetClient().Database("superCook").Collection("recipes")
	filter := bson.M{"user_code": user, "_id": id}

	result, err := collection.DeleteOne(context.TODO(), filter)

	if err != nil {
		return nil, err
	}

	return result, nil
}
