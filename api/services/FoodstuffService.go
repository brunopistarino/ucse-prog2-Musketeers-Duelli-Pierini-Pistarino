package services

import (
	"api/dto"
	"api/repositories"
	"api/utils"
	"fmt"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FoodstuffInterface interface {
	GetFoodstuffs(user dto.User) ([]*dto.Foodstuff, dto.RequestError)
	GetFoodstuffsBelowMinimum(user dto.User, meal string, name string) ([]*dto.Foodstuff, dto.RequestError)
	GetFoodstuff(user dto.User, id string) (*dto.Foodstuff, dto.RequestError)
	CreateFoodstuff(user dto.User, foodstuff *dto.Foodstuff) dto.RequestError
	UpdateFoodstuff(user dto.User, foodstuff *dto.Foodstuff, id string) dto.RequestError
	DeleteFoodstuff(user dto.User, id string) dto.RequestError
}

type FoodstuffService struct {
	foodstuffRepository repositories.FoodstuffRepositoryInterface
}

func NewFoodstuffService(foodstuffRepository repositories.FoodstuffRepositoryInterface) *FoodstuffService {
	return &FoodstuffService{
		foodstuffRepository: foodstuffRepository,
	}
}

func (service *FoodstuffService) GetFoodstuffs(user dto.User) ([]*dto.Foodstuff, dto.RequestError) {
	foodstuffsDB, err := service.foodstuffRepository.GetFoodstuffs(user.Code)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	var foodstuffs []*dto.Foodstuff
	for _, foodstuffDB := range foodstuffsDB {
		foodstuff := dto.NewFoodstuff(foodstuffDB)
		foodstuffs = append(foodstuffs, foodstuff)
	}
	if len(foodstuffs) == 0 {
		foodstuffs = []*dto.Foodstuff{}
	}
	return foodstuffs, dto.RequestError{}
}

func (service *FoodstuffService) GetFoodstuff(user dto.User, id string) (*dto.Foodstuff, dto.RequestError) {
	foodstuffDB, err := service.foodstuffRepository.GetFoodstuff(user.Code, id)

	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			return nil, *dto.NotFoundError(fmt.Errorf("foodstuff with id %v not found", id))
		}
		return nil, *dto.InternalServerError()
	}

	foodstuff := dto.NewFoodstuff(foodstuffDB)
	return foodstuff, dto.RequestError{}
}

func (service *FoodstuffService) CreateFoodstuff(user dto.User, foodstuff *dto.Foodstuff) dto.RequestError {

	err := foodstuff.VerifyFoodstuff()
	if err != nil {
		return *dto.NewRequestErrorWithMessages(http.StatusBadRequest, err)
	}

	foodstuffDB := foodstuff.GetModel()
	foodstuffDB.UserCode = user.Code
	now := time.Now()

	foodstuffDB.CreatedAt = primitive.NewDateTimeFromTime(now)
	foodstuffDB.UpdatedAt = primitive.NewDateTimeFromTime(time.Time{})
	insertOneResult, errInsert := service.foodstuffRepository.CreateFoodstuff(foodstuffDB)
	resultID := insertOneResult.InsertedID.(primitive.ObjectID)

	if errInsert != nil {
		return *dto.InternalServerError()
	}
	foodstuff.ID = utils.GetStringIDFromObjectID(resultID)
	return dto.RequestError{}
}

func (service *FoodstuffService) UpdateFoodstuff(user dto.User, foodstuff *dto.Foodstuff, id string) dto.RequestError {
	err := foodstuff.VerifyFoodstuff()
	if err != nil {
		return *dto.NewRequestErrorWithMessages(http.StatusBadRequest, err)
	}
	if id == "" {
		return *dto.NewRequestError(http.StatusBadRequest, dto.RequiredID)
	}
	foodstuff.ID = id
	foodstuffDB := foodstuff.GetModel()
	foodstuffDB.UserCode = user.Code
	now := time.Now()
	foodstuffDB.UpdatedAt = primitive.NewDateTimeFromTime(now)

	updateResult, errInsert := service.foodstuffRepository.UpdateFoodstuff(foodstuffDB)
	if errInsert != nil {
		return *dto.InternalServerError()
	}
	if updateResult.MatchedCount == 0 {
		return *dto.NotFoundError(fmt.Errorf("foodstuff with id %v not found", id))
	}
	return dto.RequestError{}
}

func (service *FoodstuffService) DeleteFoodstuff(user dto.User, id string) dto.RequestError {
	objectID := utils.GetObjectIDFromStringID(id)

	deleteResult, err := service.foodstuffRepository.DeleteFoodstuff(user.Code, objectID)
	if err != nil {
		return *dto.InternalServerError()
	}
	if deleteResult.DeletedCount == 0 {
		return *dto.NotFoundError(fmt.Errorf("foodstuff with id %v not found", id))
	}
	return dto.RequestError{}
}

// Used for 'Purchases'
func (service *FoodstuffService) GetFoodstuffsBelowMinimum(user dto.User, meal string, name string) ([]*dto.Foodstuff, dto.RequestError) {

	if meal != "" && !utils.StringExistsInSlice(meal, dto.FoodstuffType) {
		return nil, *dto.NewRequestError(http.StatusBadRequest, dto.InvalidFoodstuffType)
	}

	foodstuffsDB, err := service.foodstuffRepository.GetFoodstuffsBelowMinimum(user.Code, meal, name)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	var foodstuffs []*dto.Foodstuff
	for _, foodstuffDB := range foodstuffsDB {
		foodstuff := dto.NewFoodstuff(foodstuffDB)
		foodstuffs = append(foodstuffs, foodstuff)
	}
	if len(foodstuffs) == 0 {
		foodstuffs = []*dto.Foodstuff{}
	}
	return foodstuffs, dto.RequestError{}
}
