package dto

import (
	"api/model"
	"api/utils"
)

type Recipe struct {
	ID          string       `json:"id" binding:"omitempty"`
	Name        string       `json:"name"`
	Meal        string       `json:"meal"`
	Ingredients []Ingredient `json:"ingredients"`
}

type Ingredient struct {
	ID       string `json:"id"`
	Name     string `json:"name" binding:"omitempty"`
	Type     string `json:"type" binding:"omitempty"`
	Quantity int    `json:"quantity"`
}

func NewRecipe(recipe model.Recipe, ingredients []Ingredient) *Recipe {
	return &Recipe{
		ID:          utils.GetStringIDFromObjectID(recipe.ID),
		Name:        recipe.Name,
		Meal:        recipe.Meal,
		Ingredients: ingredients,
	}
}

func (recipe Recipe) GetModel() model.Recipe {
	return model.Recipe{
		ID:          utils.GetObjectIDFromStringID(recipe.ID),
		Name:        recipe.Name,
		Meal:        recipe.Meal,
		Ingredients: *getModelIngredients(recipe.Ingredients),
	}
}

// DTO ingredients
func NewIngredients(foodstuffs []model.Foodstuff, quantities []int) *[]Ingredient {
	var ingredients []Ingredient
	for i, foodstuff := range foodstuffs {
		ingredients = append(ingredients, *newIngredient(foodstuff, quantities[i]))
	}
	return &ingredients
}

func newIngredient(foodstuff model.Foodstuff, quantity int) *Ingredient {
	return &Ingredient{
		ID:       utils.GetStringIDFromObjectID(foodstuff.ID),
		Name:     foodstuff.Name,
		Type:     foodstuff.Type,
		Quantity: quantity,
	}
}

// Model ingredients
func getModelIngredients(ingredient []Ingredient) *[]model.Ingredient {
	var ingredients []model.Ingredient
	for _, ingredient := range ingredient {
		ingredients = append(ingredients, *getModelIngredient(ingredient))
	}
	return &ingredients
}

func getModelIngredient(ingredient Ingredient) *model.Ingredient {
	return &model.Ingredient{
		ID:       utils.GetObjectIDFromStringID(ingredient.ID),
		Quantity: ingredient.Quantity,
	}
}

func (recipe Recipe) VerifyRecipe() []RequestMessage {
	var errs []RequestMessage
	if recipe.Name == "" {
		errs = append(errs, *NewDefaultRequestMessage(RequiredName))
	} else if len(recipe.Name) < 2 || len(recipe.Name) > 50 {
		errs = append(errs, *NewDefaultRequestMessage(InvalidName))
	}
	if !utils.StringExistsInSlice(recipe.Meal, Meals) {
		errs = append(errs, *NewDefaultRequestMessage(InvalidFoodstuffMeal))
	}
	if len(recipe.Ingredients) == 0 {
		errs = append(errs, *NewDefaultRequestMessage(RequiredIngredients))
	} else {
		for _, ingredient := range recipe.Ingredients {
			if ingredient.ID == "" {
				errs = append(errs, *NewDefaultRequestMessage(RequiredIngredientID))
			}
			if ingredient.Quantity <= 0 {
				errs = append(errs, *NewDefaultRequestMessage(InvalidIngredientQuantity))
			}
		}
	}
	// find repeated IDs
	var ids []string
	for _, ingredient := range recipe.Ingredients {
		ids = append(ids, ingredient.ID)
	}
	if utils.HasDuplicates(ids) {
		errs = append(errs, *NewDefaultRequestMessage(DuplicatedFoodstuffIngredients))
	}
	return errs
}
