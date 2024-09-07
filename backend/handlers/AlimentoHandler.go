package handlers

import (
	"backend/services"

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

func (handler *AlimentoHandler) Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}
