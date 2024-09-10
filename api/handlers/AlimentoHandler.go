package handlers

import (
	"api/dto"
	"api/services"
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
	log.Print("[handler:AlimentoHandler][method:GetAlimentos][info:GET_ALL]")
	alimentos, err := handler.alimentoService.GetAlimentos()

	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:GetAlimentos][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(500, gin.H{
			"error": err,
		})
		return
	}
	log.Printf("[handler:AlimentoHandler][method:GetAlimentos][reason:SUCCESS_GET][alimentos:%d]", len(alimentos))
	c.JSON(200, alimentos)
}

func (handler *AlimentoHandler) GetAlimentosBelowMinimum(c *gin.Context) {
	log.Print("[handler:AlimentoHandler][method:GetAlimentosBelowMinimum][info:GET_BELOW_MINIMUM]")

	alimentoType := c.Query("type")
	name := c.Query("name")

	alimentos, err := handler.alimentoService.GetAlimentosBelowMinimum(alimentoType, name)

	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:GetAlimentosBelowMinimum][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(500, gin.H{
			"error": err,
		})
		return
	}
	log.Printf("[handler:AlimentoHandler][method:GetAlimentosBelowMinimum][reason:SUCCESS_GET][alimentos:%d]", len(alimentos))
	c.JSON(200, alimentos)
}

func (handler *AlimentoHandler) GetAlimento(c *gin.Context) {
	log.Print("[handler:AlimentoHandler][method:GetAlimento][info:GET_ONE]")

	id := c.Param("id")
	alimento, err := handler.alimentoService.GetAlimento(id)

	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:GetAlimento][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}
	log.Printf("[handler:AlimentoHandler][method:GetAlimento][reason:SUCCESS_GET][alimento:%s]", alimento.Nombre)
	c.JSON(http.StatusOK, alimento)
}

func (handler *AlimentoHandler) PostAlimento(c *gin.Context) {
	log.Print("[handler:AlimentoHandler][method:PostAlimento][info:POST]")

	var alimento dto.Alimento
	err := c.BindJSON(&alimento)
	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:PostAlimento][reason:ERROR_BIND][error:%s]", err.Error())
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	err = handler.alimentoService.PostAlimento(&alimento)

	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:PostAlimento][reason:ERROR_PUT][error:%s]", err.Error())
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	log.Printf("[handler:AlimentoHandler][method:PostAlimento][reason:SUCCESS_PUT][alimento:%s]", alimento.Nombre)
	c.JSON(http.StatusCreated, alimento)
}

func (handler *AlimentoHandler) PutAlimento(c *gin.Context) {
	log.Print("[handler:AlimentoHandler][method:PutAlimento][info:PUT]")

	var alimento dto.Alimento
	err := c.BindJSON(&alimento)
	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:PutAlimento][reason:ERROR_BIND][error:%s]", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	alimento.ID = c.Param("id")
	if alimento.ID == "" {
		log.Printf("[handler:AlimentoHandler][method:PutAlimento][reason:ERROR_PUT][error:%s]", "ID is required")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID is required",
		})
		return
	}

	err = handler.alimentoService.PutAlimento(&alimento)

	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:PutAlimento][reason:ERROR_PUT][error:%s]", err.Error())
		if err.Error() == "NF" {

			c.JSON(http.StatusNotFound, gin.H{
				"error": "Resource of id " + alimento.ID + " not found.",
			})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	log.Printf("[handler:AlimentoHandler][method:PutAlimento][reason:SUCCESS_PUT][alimento:%s]", alimento.Nombre)
	c.JSON(http.StatusCreated, alimento)
}

func (handler *AlimentoHandler) DeleteAlimento(c *gin.Context) {
	log.Print("[handler:AlimentoHandler][method:DeleteAlimento][info:DELETE]")

	id := c.Param("id")
	err := handler.alimentoService.DeleteAlimento(id)

	if err != nil {
		log.Printf("[handler:AlimentoHandler][method:DeleteAlimento][reason:ERROR_DELETE][error:%s]", err.Error())
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}
	log.Printf("[handler:AlimentoHandler][method:DeleteAlimento][reason:SUCCESS_DELETE][id:%s]", id)
	c.JSON(http.StatusNoContent, nil)
}
