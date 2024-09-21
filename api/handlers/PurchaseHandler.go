package handlers

import (
	"api/dto"
	"api/services"
	"api/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PurchaseHandler struct {
	purchaseService services.PurchaseInterface
}

func NewPurchaseHandler(purchaseService services.PurchaseInterface) *PurchaseHandler {
	return &PurchaseHandler{
		purchaseService: purchaseService,
	}
}

func (handler *PurchaseHandler) GetPurchases(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:PurchaseHandler][method:GetPurchases][info:GET_ALL]")
	purchases, err := handler.purchaseService.GetPurchases(user.Code)

	if err.IsDefined() {
		log.Printf("[handler:PurchaseHandler][method:GetPurchases][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:PurchaseHandler][method:GetPurchases][reason:SUCCESS_GET][purchases:%d]", len(purchases))
	c.JSON(200, purchases)
}

func (handler *PurchaseHandler) PostPurchase(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:PurchaseHandler][method:PostPurchase][info:POST]")

	// Bind an array of strings from a query parameter
	ids := c.QueryArray("ids")
	if len(ids) == 0 {
		log.Printf("[handler:PurchaseHandler][method:PostPurchase][info:No ids provided]")
	} else {
		log.Printf("[handler:PurchaseHandler][method:PostPurchase][info:POST][ids:%s]", ids)
	}

	purchase, err := handler.purchaseService.PostPurchase(user.Code, ids)

	if err.IsDefined() {
		log.Printf("[handler:PurchaseHandler][method:PostPurchase][reason:ERROR_POST][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:PurchaseHandler][method:PostPurchase][reason:SUCCESS_POST]")

	c.JSON(http.StatusCreated, purchase)
}