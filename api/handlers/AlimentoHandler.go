package handlers

import (
	"api/dto"
	"api/services"
	"api/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AlimentoHandler struct {
	alimentoService services.AlimentoInterface
}

func NewAlimentoHandler(alimentoService services.AlimentoInterface) *AlimentoHandler {
	return &AlimentoHandler{
		alimentoService: alimentoService,
	}
}

func (handler *AlimentoHandler) GetAlimentos(c *gin.Context) {

	user := dto.NewUser(utils.GetUserInfoFromContext(c))

	log.Printf("[handler:AlimentoHandler][method:GetAlimentos][info:GET_ALL][user:%s]", user.Username)
	alimentos, err := handler.alimentoService.GetAlimentos(user.Codigo)

	if err.IsDefined() {
		log.Printf("[handler:AlimentoHandler][method:GetAlimentos][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:AlimentoHandler][method:GetAlimentos][reason:SUCCESS_GET][alimentos:%d]", len(alimentos))
	c.JSON(200, alimentos)
}

func (handler *AlimentoHandler) GetAlimentosBelowMinimum(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:AlimentoHandler][method:GetAlimentosBelowMinimum][info:GET_BELOW_MINIMUM]")

	alimentoType := c.Query("type")
	name := c.Query("name")

	alimentos, err := handler.alimentoService.GetAlimentosBelowMinimum(user.Codigo, alimentoType, name)

	if err.IsDefined() {
		log.Printf("[handler:AlimentoHandler][method:GetAlimentosBelowMinimum][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:AlimentoHandler][method:GetAlimentosBelowMinimum][reason:SUCCESS_GET][alimentos:%d]", len(alimentos))
	c.JSON(200, alimentos)
}

func (handler *AlimentoHandler) GetAlimento(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:AlimentoHandler][method:GetAlimento][info:GET_ONE]")

	id := c.Param("id")
	alimento, err := handler.alimentoService.GetAlimento(user.Codigo, id)

	if err.IsDefined() {
		log.Printf("[handler:AlimentoHandler][method:GetAlimento][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:AlimentoHandler][method:GetAlimento][reason:SUCCESS_GET][alimento:%s]", alimento.Nombre)
	c.JSON(http.StatusOK, alimento)
}

func (handler *AlimentoHandler) PostAlimento(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:AlimentoHandler][method:PostAlimento][info:POST]")

	var alimento dto.Alimento
	err := c.BindJSON(&alimento)
	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:PostAlimento][reason:ERROR_BIND][error:%s]", err.Error())
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}

	errorService := handler.alimentoService.PostAlimento(user.Codigo, &alimento)

	if errorService.IsDefined() {
		log.Printf("[handler:AlimentoHandler][method:PostAlimento][reason:ERROR_PUT][error:%s]", errorService.Error())
		c.JSON(errorService.StatusCode, errorService)
		return
	}

	log.Printf("[handler:AlimentoHandler][method:PostAlimento][reason:SUCCESS_PUT][alimento:%s]", alimento.Nombre)
	c.JSON(http.StatusCreated, alimento)
}

func (handler *AlimentoHandler) PutAlimento(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:AlimentoHandler][method:PutAlimento][info:PUT]")

	var alimento dto.Alimento
	err := c.BindJSON(&alimento)
	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:PutAlimento][reason:ERROR_BIND][error:%s]", err.Error())
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}
	id := c.Param("id")

	errorService := handler.alimentoService.PutAlimento(user.Codigo, &alimento, id)

	if errorService.IsDefined() {
		log.Printf("[handler:AlimentoHandler][method:PutAlimento][reason:ERROR_PUT][error:%s]", errorService.Error())
		c.JSON(errorService.StatusCode, errorService)
		return
	}

	log.Printf("[handler:AlimentoHandler][method:PutAlimento][reason:SUCCESS_PUT][alimento:%s]", alimento.Nombre)
	c.JSON(http.StatusOK, alimento)
}

func (handler *AlimentoHandler) DeleteAlimento(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:AlimentoHandler][method:DeleteAlimento][info:DELETE]")

	id := c.Param("id")
	err := handler.alimentoService.DeleteAlimento(user.Codigo, id)

	if err.IsDefined() {
		log.Printf("[handler:AlimentoHandler][method:DeleteAlimento][reason:ERROR_DELETE][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:AlimentoHandler][method:DeleteAlimento][reason:SUCCESS_DELETE][id:%s]", id)
	c.JSON(http.StatusNoContent, nil)
}
