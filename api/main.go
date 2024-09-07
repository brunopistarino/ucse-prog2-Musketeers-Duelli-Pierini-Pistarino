package main

import (
	"api/handlers"
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
	alimentos.GET("/", alimentoHandler.Ping)
}

func dependencies() {
	// var db
	// var repositories
	// var services
	var alimentoService = services.NewAlimentoService()
	alimentoHandler = handlers.NewAlimentoHandler(alimentoService)
}
