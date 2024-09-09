package main

import (
	"api/handlers"
	"api/repositories"
	"api/services"

	"github.com/gin-gonic/gin"
)

var (
	alimentoHandler *handlers.AlimentoHandler
	//recetaHandler   *handlers.RecetaHandler
	compraHandler *handlers.CompraHandler
	router        *gin.Engine
)

func main() {

	router = gin.Default()

	dependencies()

	mappingRoutes()

	router.Run(":8080")
}

func mappingRoutes() {

	alimentos := router.Group("/alimentos")

	alimentos.GET("/", alimentoHandler.GetAlimentos)
	alimentos.GET("/:id", alimentoHandler.GetAlimento)
	alimentos.POST("/", alimentoHandler.PostAlimento)
	alimentos.PUT("/:id", alimentoHandler.PutAlimento)
	alimentos.DELETE("/:id", alimentoHandler.DeleteAlimento)
	alimentos.GET("/below_minimum", alimentoHandler.GetAlimentosBelowMinimum)
	/*
		recetas := router.Group("/recetas")
	*/

	compras := router.Group("/compras")

	compras.GET("/", compraHandler.GetCompras)
	compras.POST("/", compraHandler.PostCompra)
}

func dependencies() {
	var database = repositories.NewMongoDB()

	alimentoRepository := repositories.NewAlimentoRepository(database)
	compraRepository := repositories.NewCompraRepository(database)
	//recetaRepository := repositories.NewRecetaRepository(database)

	alimentoService := services.NewAlimentoService(alimentoRepository)
	compraService := services.NewCompraService(alimentoRepository, compraRepository)
	//recetaService := services.NewRecetaService(recetaRepository)

	alimentoHandler = handlers.NewAlimentoHandler(alimentoService)
	compraHandler = handlers.NewCompraHandler(compraService)
	//recetaHandler = handlers.NewRecetaHandler(recetaService)

}
