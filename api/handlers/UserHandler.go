package handlers

import (
	"api/dto"
	"api/services"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService services.UserInterface
}

func NewUserHandler(userService services.UserInterface) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

func (handler *UserHandler) RegisterUser(c *gin.Context) {
	log.Print("[handler:UserHandler][method:RegisterUser][info:POST]")

	var user dto.UserRegister
	if err := c.ShouldBindJSON(&user); err != nil {
		log.Printf("[handler:UserHandler][method:RegisterUser][reason:ERROR_POST_1][error:%s]", err.Error())
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}

	err := handler.userService.RegisterUser(&user)

	if err.IsDefined() {
		log.Printf("[handler:UserHandler][method:RegisterUser][reason:ERROR_POST_2][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:UserHandler][method:RegisterUser][reason:SUCCESS_POST]")

	c.Status(http.StatusCreated)
}

func (handler *UserHandler) LoginUser(c *gin.Context) {
	log.Print("[handler:UserHandler][method:LoginUser][info:POST]")

	var user dto.UserLogin
	if err := c.ShouldBindJSON(&user); err != nil {
		log.Printf("[handler:UserHandler][method:LoginUser][reason:ERROR_POST_1][error:%s]", err.Error())
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}

	response, err := handler.userService.LoginUser(&user)

	if err.IsDefined() {
		log.Printf("[handler:UserHandler][method:LoginUser][reason:ERROR_POST_2][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:UserHandler][method:LoginUser][reason:SUCCESS_POST]")

	// Add header
	c.Header("Authorization", response.AccessToken)
	c.Header("Expires-In", strconv.Itoa(response.ExpiresIn))

	c.Status(http.StatusOK)
}
