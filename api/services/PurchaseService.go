package services

import (
	"api/dto"
	"api/model"
	"api/repositories"
	"api/utils"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PurchaseInterface interface {
	GetPurchases(user dto.User) ([]*dto.Purchase, dto.RequestError)
	CreatePurchase(user dto.User, ids []string) (*dto.Purchase, dto.RequestError)
}

type PurchaseService struct {
	foodstuffRepository repositories.FoodstuffRepositoryInterface
	PurchaseRepository  repositories.PurchaseRepositoryInterface
}

func NewPurchaseService(foodstuffRepository repositories.FoodstuffRepositoryInterface, purchaseRepository repositories.PurchaseRepositoryInterface) *PurchaseService {
	return &PurchaseService{
		foodstuffRepository: foodstuffRepository,
		PurchaseRepository:  purchaseRepository,
	}
}

func (service *PurchaseService) GetPurchases(user dto.User) ([]*dto.Purchase, dto.RequestError) {
	purchasesDB, err := service.PurchaseRepository.GetPurchases(user)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	var purchases []*dto.Purchase
	for _, purchaseDB := range purchasesDB {
		purchase := dto.NewPurchase(purchaseDB)
		purchases = append(purchases, purchase)
	}
	if len(purchases) == 0 {
		purchases = []*dto.Purchase{}
	}
	return purchases, dto.RequestError{}
}

func (service *PurchaseService) CreatePurchase(user dto.User, ids []string) (*dto.Purchase, dto.RequestError) {
	var foodstuffsDB []model.Foodstuff
	if len(ids) != 0 {
		for _, id := range ids {
			foodstuffDB, err := service.foodstuffRepository.GetFoodstuff(user, id)
			if err != nil {
				return nil, *dto.NotFoundError(fmt.Errorf("foodstuff with id %v not found", id))
			}

			foodstuffsDB = append(foodstuffsDB, foodstuffDB)
		}
	} else {
		results, err := service.foodstuffRepository.GetFoodstuffsBelowMinimum(user, "", "")
		if err != nil {
			return nil, *dto.InternalServerError()
		}
		if len(results) == 0 {
			return nil, *dto.NotFoundError(errors.New("unable to proceed with purchase: no food items are below minimum quantity"))
		}
		foodstuffsDB = results
	}

	total, err := service.foodstuffRepository.SetFoodstuffsQuantityToMinimum(user, foodstuffsDB)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	if total == 0 {
		return nil, *dto.NotFoundError(errors.New("unable to proceed with purchase: no food items are below minimum quantity"))
	}

	purchaseDB := model.Purchase{
		TotalCost: total,
		UserCode:  user.Code,
		CreatedAt: utils.GetPrimitiveDateTimeFromDate(time.Now()),
		UpdatedAt: primitive.NewDateTimeFromTime(time.Time{}),
	}

	insertOneResult, err := service.PurchaseRepository.CreatePurchase(purchaseDB)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	purchaseDB.ID = insertOneResult.InsertedID.(primitive.ObjectID)

	purchase := dto.NewPurchase(purchaseDB)

	return purchase, dto.RequestError{}
}
