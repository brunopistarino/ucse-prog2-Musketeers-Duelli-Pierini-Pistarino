package handlers

import (
	"api/dto"
	"api/services"
	"api/utils"
	"log"
	// "net/http"

	"github.com/gin-gonic/gin"
)

// ReportHandler struct
type ReportHandler struct {
	reportService services.ReportInterface

}

// NewReportHandler creates a new ReportHandler
func NewReportHandler(reportService services.ReportInterface) *ReportHandler {
	return &ReportHandler{
		reportService: reportService,
	}
}

// GetReportsByTypeOfUse handles GET /foodstuffs
func (h *ReportHandler) GetReportsByTypeOfUse(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	reports, err := h.reportService.GetReportsByTypeOfUse(user.Code)
	if err.IsDefined() {
		log.Printf("[handler:ReportHandler][method:GetReportsByTypeOfUse][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}

	log.Printf("[handler:ReportHandler][method:GetReportsByTypeOfUse][reason:SUCCESS_GET][user:%d]", len(reports))
	c.JSON(200, reports)
}

// GetReportsByTypeOfFoodstuff handles GET /recipes
func (h *ReportHandler) GetReportsByTypeOfFoodstuff(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	reports, err := h.reportService.GetReportsByTypeOfFoodstuff(user.Code)
	if err.IsDefined() {
		log.Printf("[handler:ReportHandler][method:GetReportsByTypeOfFoodstuff][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}

	log.Printf("[handler:ReportHandler][method:GetReportsByTypeOfFoodstuff][reason:SUCCESS_GET][user:%d]", len(reports))
	c.JSON(200, reports)
}

// GetMonthlyCosts handles GET /monthly_costs
func (h *ReportHandler) GetMonthlyCosts(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	reports, err := h.reportService.GetMonthlyCosts(user.Code)
	if err.IsDefined() {
		log.Printf("[handler:ReportHandler][method:GetMonthlyCosts][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}

	log.Printf("[handler:ReportHandler][method:GetMonthlyCosts][reason:SUCCESS_GET][user:%d]", len(reports))
	c.JSON(200, reports)
}

