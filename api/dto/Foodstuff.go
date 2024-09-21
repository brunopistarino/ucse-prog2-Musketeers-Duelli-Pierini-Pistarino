package dto

import (
	"api/model"
	"api/utils"
)

// Declare a constant array of types of food.
const (
	Vegetable = "Vegetable"
	Fruit     = "Fruit"
	Dairy     = "Dairy"
	Meat      = "Meat"
	Fish      = "Fish"
)

var FoodstuffType = []string{
	Vegetable,
	Fruit,
	Dairy,
	Meat,
	Fish,
}

// Declare a constant array of food 'moments'.
const (
	Breakfast = "Breakfast"
	Lunch     = "Lunch"
	Supper    = "Supper"
	Dinner    = "Dinner"
)

var Meals = []string{
	Breakfast,
	Lunch,
	Supper,
	Dinner,
}

type Foodstuff struct {
	ID              string   `json:"id" binding:"omitempty"`
	Name            string   `json:"name"`
	Type            string   `json:"type"`
	Meals           []string `json:"meals"`
	Price           float32  `json:"price"`
	CurrentQuantity int      `json:"current_quantity"`
	MinimumQuantity int      `json:"minimum_quantity"`
}

func NewFoodstuff(foodstuff model.Foodstuff) *Foodstuff {
	return &Foodstuff{
		ID:              utils.GetStringIDFromObjectID(foodstuff.ID),
		Name:            foodstuff.Name,
		Type:            foodstuff.Type,
		Meals:           foodstuff.Meals,
		Price:           foodstuff.Price,
		CurrentQuantity: foodstuff.CurrentQuantity,
		MinimumQuantity: foodstuff.MinimumQuantity,
	}
}

func (foodstuff Foodstuff) GetModel() model.Foodstuff {
	return model.Foodstuff{
		ID:              utils.GetObjectIDFromStringID(foodstuff.ID),
		Name:            foodstuff.Name,
		Type:            foodstuff.Type,
		Meals:           foodstuff.Meals,
		Price:           foodstuff.Price,
		CurrentQuantity: foodstuff.CurrentQuantity,
		MinimumQuantity: foodstuff.MinimumQuantity,
	}
}

func (foodstuff Foodstuff) VerifyFoodstuff() []RequestMessage {
	var errs []RequestMessage
	if foodstuff.ID != "" {
		errs = append(errs, *NewDefaultRequestMessage(RequestBodyID))
	}
	if foodstuff.Name == "" {
		errs = append(errs, *NewDefaultRequestMessage(RequiredName))
	} else if len(foodstuff.Name) < 2 || len(foodstuff.Name) > 50 {
		errs = append(errs, *NewDefaultRequestMessage(InvalidName))
	}

	if foodstuff.Type == "" {
		errs = append(errs, *NewDefaultRequestMessage(RequiredFoodstuffType))
	} else if !utils.StringExistsInSlice(foodstuff.Type, FoodstuffType) {
		errs = append(errs, *NewDefaultRequestMessage(InvalidFoodstuffType))
	}

	if len(foodstuff.Meals) == 0 {
		errs = append(errs, *NewDefaultRequestMessage(RequiredFoodstuffMeals))
	} else if utils.HasDuplicates(foodstuff.Meals) {
		errs = append(errs, *NewDefaultRequestMessage(DuplicatedFoodstuffMeals))
	} else {
		for _, meal := range foodstuff.Meals {
			if !utils.StringExistsInSlice(meal, Meals) {
				errs = append(errs, *NewDefaultRequestMessage(InvalidFoodstuffMeals))
				break
			}
		}
	}

	if foodstuff.Price < 0 {
		errs = append(errs, *NewDefaultRequestMessage(InvalidFoodstuffPrice))
	}
	if foodstuff.CurrentQuantity < 0 {
		errs = append(errs, *NewDefaultRequestMessage(InvalidFoodstuffCurrentQuantity))
	}
	if foodstuff.MinimumQuantity < 0 {
		errs = append(errs, *NewDefaultRequestMessage(InvalidFoodstuffMinimumQuantity))
	}
	return errs
}
