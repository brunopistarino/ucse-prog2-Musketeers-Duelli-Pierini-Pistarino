package handlers

import (
	"api/dto"
	"api/services"
	"api/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ReportHandler struct {
	reportService services.ReportInterface
}

func NewReportHandler(reportService services.ReportInterface) *ReportHandler {
	return &ReportHandler{
		reportService: reportService,
	}
}

func (h *ReportHandler) GetReportsByMeal(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Printf("[handler:ReportHandler][method:GetReportsByMeal][info:GET_RECIPE_MEAL_REPORT][user:%s]", user.Username)

	reports, err := h.reportService.GetReportsByMeal(user.Code)
	if err.IsDefined() {
		log.Printf("[handler:ReportHandler][method:GetReportsByMeal][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}

	log.Printf("[handler:ReportHandler][method:GetReportsByMeal][reason:SUCCESS_GET][report_items:%d]", len(reports))
	c.JSON(http.StatusOK, reports)
}

func (h *ReportHandler) GetReportsByTypeOfFoodstuff(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Printf("[handler:ReportHandler][method:GetReportsByTypeOfFoodstuff][info:GET_RECIPE_FOODSTUFF_TYPE_REPORT][user:%s]", user.Username)

	reports, err := h.reportService.GetReportsByTypeOfFoodstuff(user.Code)
	if err.IsDefined() {
		log.Printf("[handler:ReportHandler][method:GetReportsByTypeOfFoodstuff][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}

	log.Printf("[handler:ReportHandler][method:GetReportsByTypeOfFoodstuff][reason:SUCCESS_GET][report_items:%d]", len(reports))
	c.JSON(http.StatusOK, reports)
}

func (h *ReportHandler) GetMonthlyCosts(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Printf("[handler:ReportHandler][method:GetMonthlyCosts][info:GET_MONTHLY_COSTS][user:%s]", user.Username)

	reports, err := h.reportService.GetMonthlyCosts(user.Code)
	if err.IsDefined() {
		log.Printf("[handler:ReportHandler][method:GetMonthlyCosts][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}

	log.Printf("[handler:ReportHandler][method:GetMonthlyCosts][reason:SUCCESS_GET][report_items:%d]", len(reports))
	c.JSON(http.StatusOK, reports)
}
