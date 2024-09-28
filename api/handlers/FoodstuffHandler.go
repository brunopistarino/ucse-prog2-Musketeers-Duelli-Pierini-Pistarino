package handlers

import (
	"api/dto"
	"api/services"
	"api/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FoodstuffHandler struct {
	foodstuffService services.FoodstuffInterface
}

func NewFoodstuffHandler(foodstuffService services.FoodstuffInterface) *FoodstuffHandler {
	return &FoodstuffHandler{
		foodstuffService: foodstuffService,
	}
}

func (handler *FoodstuffHandler) GetFoodstuffs(c *gin.Context) {

	user := dto.NewUser(utils.GetUserInfoFromContext(c))

	log.Printf("[handler:FoodstuffHandler][method:GetFoodstuffs][info:GET_ALL][user:%s]", user.Username)
	foodstuffs, err := handler.foodstuffService.GetFoodstuffs(user.Code)

	if err.IsDefined() {
		log.Printf("[handler:FoodstuffHandler][method:GetFoodstuffs][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:FoodstuffHandler][method:GetFoodstuffs][reason:SUCCESS_GET][foodstuffs:%d]", len(foodstuffs))
	c.JSON(200, foodstuffs)
}

func (handler *FoodstuffHandler) GetFoodstuffsBelowMinimum(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:FoodstuffHandler][method:GetFoodstuffsBelowMinimum][info:GET_BELOW_MINIMUM]")

	foodstuffType := c.Query("type")
	name := c.Query("name")

	foodstuffs, err := handler.foodstuffService.GetFoodstuffsBelowMinimum(user.Code, foodstuffType, name)

	if err.IsDefined() {
		log.Printf("[handler:FoodstuffHandler][method:GetFoodstuffsBelowMinimum][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:FoodstuffHandler][method:GetFoodstuffsBelowMinimum][reason:SUCCESS_GET][foodstuffs:%d]", len(foodstuffs))
	c.JSON(200, foodstuffs)
}

func (handler *FoodstuffHandler) GetFoodstuff(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:FoodstuffHandler][method:GetFoodstuff][info:GET_ONE]")

	id := c.Param("id")
	foodstuff, err := handler.foodstuffService.GetFoodstuff(user.Code, id)

	if err.IsDefined() {
		log.Printf("[handler:FoodstuffHandler][method:GetFoodstuff][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:FoodstuffHandler][method:GetFoodstuff][reason:SUCCESS_GET][foodstuff:%s]", foodstuff.Name)
	c.JSON(http.StatusOK, foodstuff)
}

func (handler *FoodstuffHandler) PostFoodstuff(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:FoodstuffHandler][method:PostFoodstuff][info:POST]")

	var foodstuff dto.Foodstuff
	err := c.ShouldBindJSON(&foodstuff)
	if err != nil {
		log.Printf("[handler:FoodstuffHandler][method:PostFoodstuff][reason:ERROR_BIND][error:%s]", err.Error())
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}

	errorService := handler.foodstuffService.PostFoodstuff(user.Code, &foodstuff)

	if errorService.IsDefined() {
		log.Printf("[handler:FoodstuffHandler][method:PostFoodstuff][reason:ERROR_PUT][error:%s]", errorService.Error())
		c.JSON(errorService.StatusCode, errorService)
		return
	}

	log.Printf("[handler:FoodstuffHandler][method:PostFoodstuff][reason:SUCCESS_PUT][foodstuff:%s]", foodstuff.Name)
	c.JSON(http.StatusCreated, foodstuff)
}

func (handler *FoodstuffHandler) PutFoodstuff(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:FoodstuffHandler][method:PutFoodstuff][info:PUT]")

	var foodstuff dto.Foodstuff
	err := c.ShouldBindJSON(&foodstuff)
	if err != nil {
		log.Printf("[handler:FoodstuffHandler][method:PutFoodstuff][reason:ERROR_BIND][error:%s]", err.Error())
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}
	id := c.Param("id")

	errorService := handler.foodstuffService.PutFoodstuff(user.Code, &foodstuff, id)

	if errorService.IsDefined() {
		log.Printf("[handler:FoodstuffHandler][method:PutFoodstuff][reason:ERROR_PUT][error:%s]", errorService.Error())
		c.JSON(errorService.StatusCode, errorService)
		return
	}

	log.Printf("[handler:FoodstuffHandler][method:PutFoodstuff][reason:SUCCESS_PUT][foodstuff:%s]", foodstuff.Name)
	c.JSON(http.StatusOK, foodstuff)
}

func (handler *FoodstuffHandler) DeleteFoodstuff(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:FoodstuffHandler][method:DeleteFoodstuff][info:DELETE]")

	id := c.Param("id")
	err := handler.foodstuffService.DeleteFoodstuff(user.Code, id)

	if err.IsDefined() {
		log.Printf("[handler:FoodstuffHandler][method:DeleteFoodstuff][reason:ERROR_DELETE][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:FoodstuffHandler][method:DeleteFoodstuff][reason:SUCCESS_DELETE][id:%s]", id)
	c.JSON(http.StatusOK, dto.DeleteResponse{
		Message:    "Foodstuff deleted",
		ResourceID: id,
	})
}
