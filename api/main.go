package main

import (
	"api/handlers"
	"api/repositories"
	"api/services"

	"github.com/gin-gonic/gin"
)

var (
	alimentoHandler *handlers.AlimentoHandler
	router          *gin.Engine
)

func main() {

	router = gin.Default()

	dependencies()

	mappingRoutes()

	router.Run(":8080")
}

func mappingRoutes() {

	alimentos := router.Group("/alimentos")
	/*
		recetas := router.Group("/recetas")
		compras := router.Group("/compras")
	*/

	alimentos.GET("", alimentoHandler.GetAlimentos)
	alimentos.GET("/:id", alimentoHandler.GetAlimento)
	alimentos.POST("", alimentoHandler.PostAlimento)
	alimentos.PUT("/:id", alimentoHandler.PutAlimento)
	alimentos.DELETE("/:id", alimentoHandler.DeleteAlimento)
}

func dependencies() {
	var database repositories.DB

	// Alimentos
	var alimentoRepository repositories.AlimentoRepositoryInterface
	var alimentoService services.AlimentoInterface

	database = repositories.NewMongoDB()
	alimentoRepository = repositories.NewAlimentoRepository(database)
	alimentoService = services.NewAlimentoService(alimentoRepository)
	alimentoHandler = handlers.NewAlimentoHandler(alimentoService)
	//

	// Recetas

	//

	// Compras

	//
}
