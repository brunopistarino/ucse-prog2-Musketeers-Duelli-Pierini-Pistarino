package services

import (
	"api/dto"
	"api/repositories"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ReportInterface interface {
	GetReportsByMeal(user dto.User) ([]*dto.ReportRecipeUse, dto.RequestError)
	GetReportsByTypeOfFoodstuff(user dto.User) ([]*dto.ReportRecipeFoodstuff, dto.RequestError)
	GetMonthlyCosts(user dto.User) ([]*dto.ReportMonthCost, dto.RequestError)
}

type ReportService struct {
	recipeRepository    repositories.RecipeRepositoryInterface
	purchaseRepository  repositories.PurchaseRepositoryInterface
	foodstuffRepository repositories.FoodstuffRepositoryInterface
}

func NewReportService(recipeRepository repositories.RecipeRepositoryInterface, purchaseRepository repositories.PurchaseRepositoryInterface, foodstuffRepository repositories.FoodstuffRepositoryInterface) *ReportService {
	return &ReportService{
		recipeRepository:    recipeRepository,
		purchaseRepository:  purchaseRepository,
		foodstuffRepository: foodstuffRepository,
	}
}

func (service *ReportService) GetReportsByMeal(user dto.User) ([]*dto.ReportRecipeUse, dto.RequestError) {
	recipesDB, err := service.recipeRepository.GetRecipes(user.Code, "", "")

	if err != nil {
		return nil, *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}

	var reportRecipeUses []*dto.ReportRecipeUse
	for _, recipe := range recipesDB {
		switch recipe.Meal {
		case dto.Breakfast:
			if isTypeOfUseNotInReport(dto.Breakfast, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, &dto.ReportRecipeUse{
					TypeOfUse: dto.Breakfast,
					Count:     1,
				})
			} else {
				for i, reportRecipeUse := range reportRecipeUses {
					if reportRecipeUse.TypeOfUse == dto.Breakfast {
						reportRecipeUses[i].Count++
						break
					}
				}
			}
		case dto.Lunch:
			if isTypeOfUseNotInReport(dto.Lunch, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, &dto.ReportRecipeUse{
					TypeOfUse: dto.Lunch,
					Count:     1,
				})
			} else {
				for i, reportRecipeUse := range reportRecipeUses {
					if reportRecipeUse.TypeOfUse == dto.Lunch {
						reportRecipeUses[i].Count++
						break
					}
				}
			}
		case dto.Supper:
			if isTypeOfUseNotInReport(dto.Supper, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, &dto.ReportRecipeUse{
					TypeOfUse: dto.Supper,
					Count:     1,
				})
			} else {
				for i, reportRecipeUse := range reportRecipeUses {
					if reportRecipeUse.TypeOfUse == dto.Supper {
						reportRecipeUses[i].Count++
						break
					}
				}
			}
		case dto.Dinner:
			if isTypeOfUseNotInReport(dto.Dinner, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, &dto.ReportRecipeUse{
					TypeOfUse: dto.Dinner,
					Count:     1,
				})
			} else {
				for i, reportRecipeUse := range reportRecipeUses {
					if reportRecipeUse.TypeOfUse == dto.Dinner {
						reportRecipeUses[i].Count++
						break
					}
				}
			}
		}
	}
	if len(reportRecipeUses) == 0 {
		reportRecipeUses = []*dto.ReportRecipeUse{}
	}
	return reportRecipeUses, dto.RequestError{}
}

func (service *ReportService) GetReportsByTypeOfFoodstuff(user dto.User) ([]*dto.ReportRecipeFoodstuff, dto.RequestError) {
	recipesDB, err := service.recipeRepository.GetRecipes(user.Code, "", "")
	if err != nil {
		return nil, *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}

	foodstuffDB, err := service.foodstuffRepository.GetFoodstuffs(user.Code)
	if err != nil {
		return nil, *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}

	foodstuffMap := make(map[primitive.ObjectID]string)
	for _, foodstuff := range foodstuffDB {
		foodstuffMap[foodstuff.ID] = foodstuff.Type
	}

	reportRecipeFoodstuffs := make(map[string]int)
	for _, recipe := range recipesDB {
		foodstuffTypesInRecipe := make(map[string]bool)
		for _, ingredient := range recipe.Ingredients {
			if foodstuffType, exists := foodstuffMap[ingredient.ID]; exists {
				foodstuffTypesInRecipe[foodstuffType] = true
			}
		}
		for foodstuffType := range foodstuffTypesInRecipe {
			reportRecipeFoodstuffs[foodstuffType]++
		}
	}

	var reportRecipeFoodstuffList []*dto.ReportRecipeFoodstuff
	for foodstuffType, count := range reportRecipeFoodstuffs {
		reportRecipeFoodstuffList = append(reportRecipeFoodstuffList, &dto.ReportRecipeFoodstuff{
			TypeOfFoodstuff: foodstuffType,
			Count:           count,
		})
	}
	if len(reportRecipeFoodstuffList) == 0 {
		reportRecipeFoodstuffList = []*dto.ReportRecipeFoodstuff{}
	}

	return reportRecipeFoodstuffList, dto.RequestError{}
}

func (service *ReportService) GetMonthlyCosts(user dto.User) ([]*dto.ReportMonthCost, dto.RequestError) {
	purchasesDB, err := service.purchaseRepository.GetPurchases(user.Code)

	if err != nil {
		return nil, *dto.NewRequestError(http.StatusInternalServerError, dto.DatabaseInternalError)
	}

	monthlyCosts := make(map[string]float64)

	currentTime := time.Now()
	startTime := currentTime.AddDate(-1, 0, 0)

	for _, purchase := range purchasesDB {
		purchaseTime := purchase.CreatedAt.Time()

		if purchaseTime.After(startTime) && purchaseTime.Before(currentTime.AddDate(0, 1, 0)) {
			month := purchaseTime.Format("2006-01")
			monthlyCosts[month] += float64(purchase.TotalCost)
		}
	}

	var ReportMonthCosts []*dto.ReportMonthCost
	for i := 0; i <= 12; i++ {
		month := startTime.AddDate(0, i, 0).Format("2006-01")
		totalCost := monthlyCosts[month]
		ReportMonthCosts = append(ReportMonthCosts, &dto.ReportMonthCost{
			Month: month,
			Cost:  totalCost,
		})
	}

	if len(ReportMonthCosts) == 0 {
		ReportMonthCosts = []*dto.ReportMonthCost{}
	}

	return ReportMonthCosts, dto.RequestError{}
}

func isTypeOfUseNotInReport(typeOfUse string, reportRecipeUses []*dto.ReportRecipeUse) bool {
	for _, reportRecipeUse := range reportRecipeUses {
		if reportRecipeUse.TypeOfUse == typeOfUse {
			return false
		}
	}
	return true
}
