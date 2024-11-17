package services

import (
	"api/dto"
	"api/model"
	"api/repositories"
	"api/utils"
	"fmt"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RecipeInterface interface {
	GetRecipes(user dto.User, meal string, name string, foodstuffType string) ([]*dto.Recipe, dto.RequestError)
	GetRecipe(user dto.User, id string) (*dto.Recipe, dto.RequestError)
	CreateRecipe(user dto.User, recipe *dto.Recipe) dto.RequestError
	DeleteRecipe(user dto.User, id string) dto.RequestError
}

type RecipeService struct {
	recipeRepository    repositories.RecipeRepositoryInterface
	foodstuffRepository repositories.FoodstuffRepositoryInterface
}

func NewRecipeService(recipeRepository repositories.RecipeRepositoryInterface, foodstuffRepository repositories.FoodstuffRepositoryInterface) *RecipeService {
	return &RecipeService{
		recipeRepository:    recipeRepository,
		foodstuffRepository: foodstuffRepository,
	}
}

func (service *RecipeService) GetRecipes(user dto.User, meal string, name string, foodstuffType string) ([]*dto.Recipe, dto.RequestError) {
	if meal != "" && !utils.StringExistsInSlice(meal, dto.Meals) {
		return nil, *dto.NewRequestErrorWithMessages(http.StatusBadRequest, []dto.RequestMessage{*dto.NewDefaultRequestMessage(dto.InvalidFoodstuffMeal)})
	}
	if foodstuffType != "" && !utils.StringExistsInSlice(foodstuffType, dto.FoodstuffType) {
		return nil, *dto.NewRequestErrorWithMessages(http.StatusBadRequest, []dto.RequestMessage{*dto.NewDefaultRequestMessage(dto.InvalidFoodstuffType)})
	}

	recipesDB, err := service.recipeRepository.GetRecipes(user.Code, name, meal)

	if err != nil {
		return nil, *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}
	var recipes []*dto.Recipe

	for _, recipeDB := range recipesDB {
		recipe, errorDB := service.setRecipeIngredients(&recipeDB, user)
		if errorDB.IsDefined() {
			return nil, errorDB
		}
		if foodstuffType != "" {
			for _, ingredient := range recipe.Ingredients {
				if ingredient.Type == foodstuffType {
					recipes = append(recipes, &recipe)
					break
				}
			}
		} else {
			recipes = append(recipes, &recipe)
		}
	}
	if len(recipes) == 0 {
		recipes = []*dto.Recipe{}
	}
	return recipes, dto.RequestError{}
}

func (service *RecipeService) GetRecipe(user dto.User, id string) (*dto.Recipe, dto.RequestError) {
	recipeDB, err := service.recipeRepository.GetRecipe(user.Code, id)

	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			return nil, *dto.NotFoundError(fmt.Errorf("recipe with id %v not found", id))
		}
		return nil, *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}

	recipe, errorDB := service.setRecipeIngredients(&recipeDB, user)
	if errorDB.IsDefined() {
		return nil, errorDB
	}
	return &recipe, dto.RequestError{}
}

func (service *RecipeService) CreateRecipe(user dto.User, recipe *dto.Recipe) dto.RequestError {
	err := recipe.VerifyRecipe()
	if err != nil {
		return *dto.NewRequestErrorWithMessages(http.StatusBadRequest, err)
	}

	var ingredientsDB []model.Ingredient
	var foodstuffsDB []model.Foodstuff
	if len(recipe.Ingredients) != 0 {
		for _, ingredient := range recipe.Ingredients {
			id := utils.GetObjectIDFromStringID(ingredient.ID)
			foodstuffDB, err := service.foodstuffRepository.GetFoodstuffFromMealAndQuantity(user.Code, recipe.Meal, id, ingredient.Quantity)
			if err != nil {
				return *dto.NotFoundError(fmt.Errorf("foodstuff with id %v with type %s and current_quantity gte than %d not found",
					ingredient.ID, recipe.Meal, ingredient.Quantity))
			}
			foodstuffsDB = append(foodstuffsDB, foodstuffDB)
			var ingredientDB model.Ingredient
			ingredientDB.ID = id
			ingredientDB.Quantity = ingredient.Quantity
			ingredientsDB = append(ingredientsDB, ingredientDB)
		}
	}
	errorQuantityAssignment := service.foodstuffRepository.SetFoodstuffQuantityToValue(user.Code, ingredientsDB)

	if errorQuantityAssignment != nil {
		return *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}

	recipeDB := recipe.GetModel()
	recipeDB.Ingredients = ingredientsDB
	recipeDB.UserCode = user.Code
	now := time.Now()

	recipeDB.CreatedAt = primitive.NewDateTimeFromTime(now)
	recipeDB.UpdatedAt = primitive.NewDateTimeFromTime(time.Time{})
	insertOneResult, errInsert := service.recipeRepository.CreateRecipe(recipeDB)
	resultID := insertOneResult.InsertedID.(primitive.ObjectID)

	if errInsert != nil {
		return *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}
	// Assign the ingredients to recipe
	recipe.Ingredients = *dto.NewIngredients(foodstuffsDB, *getQuantities(ingredientsDB))
	recipe.ID = utils.GetStringIDFromObjectID(resultID)
	return dto.RequestError{}
}

func (service *RecipeService) DeleteRecipe(user dto.User, id string) dto.RequestError {
	objectID := utils.GetObjectIDFromStringID(id)

	// Get recipe first and ensure it exists
	recipe, err := service.recipeRepository.GetRecipe(user.Code, id)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			return *dto.NotFoundError(fmt.Errorf("recipe with id %v not found", id))
		}
		return *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}

	// For each ingredient in the recipe, set the quantity of the original foodstuff to
	// the current quantity + the quantity of the ingredient.
	// If the foodstuff does not exist, don't do anything and keep going
	for _, ingredient := range recipe.Ingredients {
		foodstuffDB, err := service.foodstuffRepository.GetFoodstuff(user.Code, utils.GetStringIDFromObjectID(ingredient.ID))
		if err != nil {
			continue
		}
		foodstuffDB.CurrentQuantity += ingredient.Quantity
		_, err = service.foodstuffRepository.UpdateFoodstuff(foodstuffDB)
		if err != nil {
			return *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
		}
	}

	// Delete the recipe
	deleteResult, err := service.recipeRepository.DeleteRecipe(user.Code, objectID)
	if err != nil {
		return *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}
	if deleteResult.DeletedCount == 0 {
		return *dto.NotFoundError(fmt.Errorf("recipe with id %v not found", id))
	}
	return dto.RequestError{}
}

// Set the recipe ingredients after search for the related foodstuffs
func (service *RecipeService) setRecipeIngredients(recipe *model.Recipe, user dto.User) (dto.Recipe, dto.RequestError) {
	var foodstuffsDB []model.Foodstuff
	if len(recipe.Ingredients) != 0 {
		for _, ingredient := range recipe.Ingredients {
			id := utils.GetStringIDFromObjectID(ingredient.ID)
			foodstuffDB, err := service.foodstuffRepository.GetFoodstuff(user.Code, id)
			if err != nil {
				if err.Error() == "mongo: no documents in result" {
					foodstuffsDB = append(foodstuffsDB, model.Foodstuff{
						ID:   ingredient.ID,
						Name: "",
						Type: "",
					})
					continue
				}
				return dto.Recipe{}, *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
			}
			foodstuffsDB = append(foodstuffsDB, foodstuffDB)
		}
	}

	var ingredients = dto.NewIngredients(foodstuffsDB, *getQuantities(recipe.Ingredients))

	recipeDTO := dto.NewRecipe(*recipe, *ingredients)
	return *recipeDTO, dto.RequestError{}
}

// Get the quantities of each ingredient in the recipe
func getQuantities(ingredients []model.Ingredient) *[]int {
	var quantities []int
	for _, ingredient := range ingredients {
		quantities = append(quantities, ingredient.Quantity)
	}
	return &quantities
}
