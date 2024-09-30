package services

import (
	"api/dto"
	// "api/model"
	"api/repositories"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	// "honnef.co/go/tools/analysis/report"
)

// reports := router.Group("/reports")
// reports.Use(authMiddleware.ValidateToken)
// reports.GET("/foodstuffs", reportHandler.GetReportsByTypeOfUse)
// reports.GET("/recipes", reportHandler.GetReportsByTypeOfFoodstuff)
// reports.GET("/monthly_costs", reportHandler.GetMonthlyCosts)

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

// cantidad de recetas que contienen cada tipo de alimento

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

// funcion para obtener los promedios mensuales del ultimo año agrupados por meses.
func (service *ReportService) GetMonthlyCosts(user string) ([]dto.ReportAverageMonth, dto.RequestError) {
	purchasesDB, err := service.purchaseRepository.GetPurchases(user)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	monthlyCosts := make(map[string]float64)
	monthlyCounts := make(map[string]int)

	currentYear := time.Now().Year()
	currentMonth := time.Now().Month()

	for _, purchase := range purchasesDB {
		purchaseYear := purchase.CreatedAt.Time().Year()
		purchaseMonth := purchase.CreatedAt.Time().Month()

		// Only consider purchases from the current year and months that have already ended
		if purchaseYear == currentYear && purchaseMonth <= currentMonth {
			month := purchase.CreatedAt.Time().Format("2006-01")
			monthlyCosts[month] += float64(purchase.TotalCost)
			monthlyCounts[month]++
		}
	}

	var reportAverageMonths []dto.ReportAverageMonth
	for month, totalCost := range monthlyCosts {
		reportAverageMonths = append(reportAverageMonths, dto.ReportAverageMonth{
			Month:       month,
			AverageCost: totalCost / float64(monthlyCounts[month]),
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
