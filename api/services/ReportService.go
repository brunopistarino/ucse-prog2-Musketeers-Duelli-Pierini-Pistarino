package services

import (
	"api/dto"

	"honnef.co/go/tools/analysis/report"
)

// reports := router.Group("/reports")
// reports.Use(authMiddleware.ValidateToken)
// reports.GET("/foodstuffs", reportHandler.GetReportsByTypeOfUse)
// reports.GET("/recipes", reportHandler.GetReportsByTypeOfFoodstuff)
// reports.GET("/monthly_costs", reportHandler.GetMonthlyCosts)

type ReportInterface interface {
	GetReportsByTypeOfUse() ([]ReportRecipeUse, RequestError)
	GetReportsByTypeOfFoodstuff() ([]ReportRecipeFoodstuff, RequestError)
	GetMonthlyCosts() ([]ReportAverageMonth, RequestError)
}

type ReportService struct {
	recipeRepository    repositories.RecipeRepositoryInterface
	purchaseRepository  repositories.PurchaseRepositoryInterface
}

func NewReportService(recipeRepository repositories.RecipeRepositoryInterface, purchaseRepository repositories.PurchaseRepositoryInterface) *ReportService {
	return &ReportService{
		recipeRepository: recipeRepository,
		purchaseRepository: purchaseRepository,
	}
}

func (service *ReportService) GetReportsByTypeOfUse(user string) ([]ReportRecipeUse, RequestError) {
	recipesDB, err := service.recipeRepository.GetRecipes(user)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	var reportRecipeUses []dto.ReportRecipeUse
	for _, recipe := range recipesDB {
		switch recipe.Meal {
		case Breakfast:
			if isTypeOfUseNotInReport(Breakfast, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, dto.ReportRecipeUse{
					TypeOfUse: Breakfast,
					Count:     1,
				})
			} else {
				for i, reportRecipeUse := range reportRecipeUses {
					if reportRecipeUse.TypeOfUse == Breakfast {
						reportRecipeUses[i].Count++
						break
					}
				}
			}
		case Lunch:
			if isTypeOfUseNotInReport(Lunch, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, dto.ReportRecipeUse{
					TypeOfUse: Lunch,
					Count:     1,
				})
			} else {
				for i, reportRecipeUse := range reportRecipeUses {
					if reportRecipeUse.TypeOfUse == Lunch {
						reportRecipeUses[i].Count++
						break
					}
				}
			}
		case Supper:
			if isTypeOfUseNotInReport(Supper, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, dto.ReportRecipeUse{
					TypeOfUse: Supper,
					Count:     1,
				})
			} else {
				for i, reportRecipeUse := range reportRecipeUses {
					if reportRecipeUse.TypeOfUse == Supper {
						reportRecipeUses[i].Count++
						break
					}
				}
			}
		case Dinner:
			if isTypeOfUseNotInReport(Dinner, reportRecipeUses) {
				reportRecipeUses = append(reportRecipeUses, dto.ReportRecipeUse{
					TypeOfUse: Dinner,
					Count:     1,
				})
			} else {
				for i, reportRecipeUse := range reportRecipeUses {
					if reportRecipeUse.TypeOfUse == Dinner {
						reportRecipeUses[i].Count++
						break
					}
				}
			}
		}
	}
	return reportRecipeUses, nil
}

func (service *ReportService) GetReportsByTypeOfFoodstuff(user string) ([]ReportRecipeFoodstuff, RequestError) {
	recipesDB, err := service.recipeRepository.GetRecipes(user)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	var reportRecipeFoodstuffs []dto.ReportRecipeFoodstuff
	for _, recipe := range recipesDB {
		for _, foodstuff := range recipe.Foodstuffs {
			if isFoodstuffNotInReport(foodstuff.Name, reportRecipeFoodstuffs) {
				reportRecipeFoodstuffs = append(reportRecipeFoodstuffs, dto.ReportRecipeFoodstuff{
					TypeOfFoodstuff:  foodstuff.Type,
					Count: 1,
				})
			} else {
				for i, reportRecipeFoodstuff := range reportRecipeFoodstuffs {
					if reportRecipeFoodstuff.TypeOfFoodstuff == foodstuff.Type {
						reportRecipeFoodstuffs[i].Count++
						break
					}
				}
			}
		}
	}
}

func (service *ReportService) GetMonthlyCosts(user string) ([]dto.ReportAverageMonth, RequestError) {
	purchasesDB, err := service.purchaseRepository.GetPurchases(user)

	if err != nil {
		return nil, *dto.InternalServerError()
	}

	monthlyCosts := make(map[string]float64)
	monthlyCounts := make(map[string]int)

	currentYear := time.Now().Year()
	currentMonth := time.Now().Month()

	for _, purchase := range purchasesDB {
		purchaseYear := purchase.Date.Year()
		purchaseMonth := purchase.Date.Month()

		// Only consider purchases from the current year and months that have already ended
		if purchaseYear == currentYear && purchaseMonth < currentMonth {
			month := purchase.Date.Format("2006-01")
			monthlyCosts[month] += purchase.Cost
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

	return reportAverageMonths, nil
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

