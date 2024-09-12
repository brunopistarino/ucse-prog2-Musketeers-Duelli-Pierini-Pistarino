package handlers

import (
	"api/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CompraHandler struct {
	compraService services.CompraInterface
}

func NewCompraHandler(compraService services.CompraInterface) *CompraHandler {
	return &CompraHandler{
		compraService: compraService,
	}
}

func (handler *CompraHandler) GetCompras(c *gin.Context) {
	log.Print("[handler:CompraHandler][method:GetCompras][info:GET_ALL]")
	compras, err := handler.compraService.GetCompras()

	if err.IsDefined() {
		log.Printf("[handler:CompraHandler][method:GetCompras][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:CompraHandler][method:GetCompras][reason:SUCCESS_GET][compras:%d]", len(compras))
	c.JSON(200, compras)
}

func (handler *CompraHandler) PostCompra(c *gin.Context) {
	log.Print("[handler:CompraHandler][method:PostCompra][info:POST]")

	// Bind an array of strings from a query parameter
	ids := c.QueryArray("ids")
	if len(ids) == 0 {
		log.Printf("[handler:CompraHandler][method:PostCompra][info:No ids provided]")
	} else {
		log.Printf("[handler:CompraHandler][method:PostCompra][info:POST][ids:%s]", ids)
	}

	compra, err := handler.compraService.PostCompra(ids)

	if err.IsDefined() {
		log.Printf("[handler:CompraHandler][method:PostCompra][reason:ERROR_POST][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:CompraHandler][method:PostCompra][reason:SUCCESS_POST]")

	c.JSON(http.StatusCreated, compra)
}
