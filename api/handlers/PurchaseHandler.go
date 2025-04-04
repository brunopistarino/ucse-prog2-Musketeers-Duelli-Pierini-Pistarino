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
	log.Printf("[handler:PurchaseHandler][method:GetPurchases][info:GET_ALL][user:%s]", user.Username)
	purchases, err := handler.purchaseService.GetPurchases(user)

	if err.IsDefined() {
		log.Printf("[handler:PurchaseHandler][method:GetPurchases][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:PurchaseHandler][method:GetPurchases][reason:SUCCESS_GET][purchases:%d]", len(purchases))
	c.JSON(200, purchases)
}

func (handler *PurchaseHandler) CreatePurchase(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Printf("[handler:PurchaseHandler][method:CreatePurchase][info:POST][user:%s]", user.Username)

	var ids []string
	errBind := c.ShouldBindJSON(&ids)
	if errBind != nil {
		log.Printf("[handler:RecipeHadler][method:CreateRecipe][reason:ERROR_BIND][error:%s]", errBind.Error())
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}
	if len(ids) == 0 {
		log.Printf("[handler:PurchaseHandler][method:CreatePurchase][info:No ids provided]")
	} else {
		log.Printf("[handler:PurchaseHandler][method:CreatePurchase][info:POST][ids:%s]", ids)
	}

	purchase, err := handler.purchaseService.CreatePurchase(user, ids)

	if err.IsDefined() {
		log.Printf("[handler:PurchaseHandler][method:CreatePurchase][reason:ERROR_POST][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:PurchaseHandler][method:CreatePurchase][reason:SUCCESS_POST]")

	c.JSON(http.StatusCreated, purchase)
}
