package dto

import "api/utils"

type RequestMessage struct {
	ID          int    `json:"msg_id"`
	Description string `json:"description"`
}

const (
	RequestBodyID                   = 40011
	RequiredName                    = 40012
	InvalidName                     = 40013
	RequiredFoodstuffType           = 40014
	InvalidFoodstuffType            = 40015
	RequiredFoodstuffMeals          = 40016
	DuplicatedFoodstuffMeals        = 40017
	InvalidFoodstuffMeals           = 40018
	InvalidFoodstuffPrice           = 40019
	InvalidFoodstuffCurrentQuantity = 40020
	InvalidFoodstuffMinimumQuantity = 40021
	RequiredID                      = 40022
	RequiredIngredients             = 40030
	RequiredIngredientID            = 40031
	InvalidIngredientQuantity       = 40032
	InvalidFoodstuffMeal            = 40033
	DuplicatedFoodstuffIngredients  = 40034
	RequiredEmail                   = 40070
	InvalidEmail                    = 40071
	RequiredPassword                = 40072
	InvalidPasswordLength           = 40073
	InvalidPasswordCharacters       = 40074
	RequiredConfirmPassword         = 40075
	PasswordsDoNotMatch             = 40076
	RequiredUsername                = 40077
	IncorrectUsernameOrPassword     = 40080
	UnsupportedGrantType            = 40081
	RegisterAPIError                = 40082
	InvalidRequestBody              = 40090
	RequiredToken                   = 40111
	DeniedAuthorization             = 40112
	DatabaseInternalError           = 50001
)

var messages = map[int]RequestMessage{
	RequestBodyID:                   {ID: RequestBodyID, Description: "request body id must not be set"},
	RequiredName:                    {ID: RequiredName, Description: "name is required"},
	InvalidName:                     {ID: InvalidName, Description: "name must be between 2 and 50 characters"},
	RequiredFoodstuffType:           {ID: RequiredFoodstuffType, Description: "type is required"},
	InvalidFoodstuffType:            {ID: InvalidFoodstuffType, Description: "type is invalid. Must be one of: " + utils.SliceToString(FoodstuffType)},
	RequiredFoodstuffMeals:          {ID: RequiredFoodstuffMeals, Description: "meals is required"},
	DuplicatedFoodstuffMeals:        {ID: DuplicatedFoodstuffMeals, Description: "meals has duplicates"},
	InvalidFoodstuffMeals:           {ID: InvalidFoodstuffMeals, Description: "meals is invalid. Must be one of: " + utils.SliceToString(Meals)},
	InvalidFoodstuffPrice:           {ID: InvalidFoodstuffPrice, Description: "price must be a positive number"},
	InvalidFoodstuffCurrentQuantity: {ID: InvalidFoodstuffCurrentQuantity, Description: "current_quantity must be a positive number"},
	InvalidFoodstuffMinimumQuantity: {ID: InvalidFoodstuffMinimumQuantity, Description: "minimum_quantity must be a positive number"},
	RequiredID:                      {ID: RequiredID, Description: "id is required"},
	RequiredIngredients:             {ID: RequiredIngredients, Description: "ingredients is required"},
	RequiredIngredientID:            {ID: RequiredIngredientID, Description: "ingredient id is required"},
	InvalidIngredientQuantity:       {ID: InvalidIngredientQuantity, Description: "quantity of ingredients must be more than 0"},
	InvalidFoodstuffMeal:            {ID: InvalidFoodstuffMeal, Description: "meal is invalid. Must be one of: " + utils.SliceToString(Meals)},
	DuplicatedFoodstuffIngredients:  {ID: DuplicatedFoodstuffIngredients, Description: "ingredients has duplicates"},
	RequiredEmail:                   {ID: RequiredEmail, Description: "email is required"},
	InvalidEmail:                    {ID: InvalidEmail, Description: "email is not valid"},
	RequiredPassword:                {ID: RequiredPassword, Description: "password is required"},
	InvalidPasswordLength:           {ID: InvalidPasswordLength, Description: "password must be at least 6 characters long"},
	InvalidPasswordCharacters:       {ID: InvalidPasswordCharacters, Description: "password must have at least one non letter character, one digit character ('0'-'9') and one uppercase character ('A'-'Z')"},
	RequiredConfirmPassword:         {ID: RequiredConfirmPassword, Description: "confirm_password is required"},
	PasswordsDoNotMatch:             {ID: PasswordsDoNotMatch, Description: "passwords do not match"},
	RequiredUsername:                {ID: RequiredUsername, Description: "username is required"},
	IncorrectUsernameOrPassword:     {ID: IncorrectUsernameOrPassword, Description: "incorrect username or password"},
	UnsupportedGrantType:            {ID: UnsupportedGrantType, Description: "unsupported_grant_type"},
	// Should be returned by the authetication API
	// RegisterAPIError:                {ID: RegisterAPIError, Description: "error registering user"},
	InvalidRequestBody:    {ID: InvalidRequestBody, Description: "invalid request body"},
	RequiredToken:         {ID: RequiredToken, Description: "token is required"},
	DeniedAuthorization:   {ID: DeniedAuthorization, Description: "authorization has been denied for this request"},
	DatabaseInternalError: {ID: DatabaseInternalError, Description: "a database related error occurred"},
}

func NewDefaultRequestMessage(id int) *RequestMessage {
	if _, ok := messages[id]; !ok {
		// Return a default message if the ID is not found.
		return &RequestMessage{
			ID:          id,
			Description: "Unknown error",
		}
	}
	return &RequestMessage{
		ID:          id,
		Description: messages[id].Description,
	}
}

func NewRequestMessage(id int, description string) *RequestMessage {
	return &RequestMessage{
		ID:          id,
		Description: description,
	}
}
