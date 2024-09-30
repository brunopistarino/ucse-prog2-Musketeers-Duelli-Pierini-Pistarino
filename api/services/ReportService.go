package services

import (
	"api/dto"
	"api/repositories"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type ReportInterface interface {
	GetReportsByTypeOfUse(user string) ([]dto.ReportRecipeUse, dto.RequestError)
	GetReportsByTypeOfFoodstuff(user string) ([]dto.ReportRecipeFoodstuff, dto.RequestError)
	GetMonthlyCosts(user string) ([]dto.ReportAverageMonth, dto.RequestError)
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

func (service *ReportService) GetReportsByTypeOfUse(user string) ([]dto.ReportRecipeUse, dto.RequestError) {
	recipesDB, err := service.recipeRepository.GetRecipes(user)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	var reportRecipeUses []dto.ReportRecipeUse
	for _, recipe := range recipesDB {
		switch recipe.Meal {
		case dto.Breakfast:
			if isTypeOfUseNotInReport(dto.Breakfast, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, dto.ReportRecipeUse{
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
				reportRecipeUses = append(reportRecipeUses, dto.ReportRecipeUse{
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
				reportRecipeUses = append(reportRecipeUses, dto.ReportRecipeUse{
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
				reportRecipeUses = append(reportRecipeUses, dto.ReportRecipeUse{
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
	return reportRecipeUses, dto.RequestError{}
}

func (service *ReportService) GetReportsByTypeOfFoodstuff(user string) ([]dto.ReportRecipeFoodstuff, dto.RequestError) {
	recipesDB, err := service.recipeRepository.GetRecipes(user)
	if err != nil {
		return nil, *dto.InternalServerError()
	}

	foodstuffDB, err := service.foodstuffRepository.GetFoodstuffs(user)
	if err != nil {
		return nil, *dto.InternalServerError()
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

	var reportRecipeFoodstuffList []dto.ReportRecipeFoodstuff
	for foodstuffType, count := range reportRecipeFoodstuffs {
		reportRecipeFoodstuffList = append(reportRecipeFoodstuffList, dto.ReportRecipeFoodstuff{
			TypeOfFoodstuff: foodstuffType,
			Count:           count,
		})
	}

	return reportRecipeFoodstuffList, dto.RequestError{}
}

func (service *ReportService) GetMonthlyCosts(user string) ([]dto.ReportAverageMonth, dto.RequestError) {
	purchasesDB, err := service.purchaseRepository.GetPurchases(user)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	monthlyCosts := make(map[string]float64)
	monthlyCounts := make(map[string]int)

	currentTime := time.Now()
	startTime := currentTime.AddDate(-1, 0, 0) // 12 months ago

	for _, purchase := range purchasesDB {
		purchaseTime := purchase.CreatedAt.Time()

		// Only consider purchases from the last 12 months
		if purchaseTime.After(startTime) && purchaseTime.Before(currentTime) {
			month := purchaseTime.Format("2006-01")
			monthlyCosts[month] += float64(purchase.TotalCost)
			monthlyCounts[month]++
		}
	}

	var reportAverageMonths []dto.ReportAverageMonth
	for i := 0; i < 12; i++ {
		month := startTime.AddDate(0, i, 0).Format("2006-01")
		totalCost := monthlyCosts[month]
		count := monthlyCounts[month]
		averageCost := 0.0
		if count > 0 {
			averageCost = totalCost / float64(count)
		}
		reportAverageMonths = append(reportAverageMonths, dto.ReportAverageMonth{
			Month:       month,
			AverageCost: averageCost,
		})
	}

	return reportAverageMonths, dto.RequestError{}
}

func isTypeOfUseNotInReport(typeOfUse string, reportRecipeUses []dto.ReportRecipeUse) bool {
	for _, reportRecipeUse := range reportRecipeUses {
		if reportRecipeUse.TypeOfUse == typeOfUse {
			return false
		}
	}
	return true
}

func isTypeOfFoodstuffNotInReport(typeOfFoodstuff string, reportRecipeFoodstuffs []dto.ReportRecipeFoodstuff) bool {
	for _, reportRecipeFoodstuff := range reportRecipeFoodstuffs {
		if reportRecipeFoodstuff.TypeOfFoodstuff == typeOfFoodstuff {
			return false
		}
	}
	return true
}
