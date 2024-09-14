package main

import (
	"api/clients"
	"api/handlers"
	"api/middlewares"
	"api/repositories"
	"api/services"

	"github.com/gin-gonic/gin"
)

var (
	alimentoHandler *handlers.AlimentoHandler
	//recetaHandler   *handlers.RecetaHandler
	compraHandler *handlers.CompraHandler
	userHandler   *handlers.UserHandler
	router        *gin.Engine
)

func main() {

	router = gin.Default()

	dependencies()

	mappingRoutes()

	router.Run(":8080")
}

func mappingRoutes() {

	// Middleware for all routes
	router.Use(middlewares.CORSMiddleware())

	authMiddleware := middlewares.NewAuthMiddleware(clients.NewAuthClient())

	usuario := router.Group("/usuario")
	usuario.POST("/login", userHandler.LoginUser)
	usuario.POST("/register", userHandler.RegisterUser)

	alimentos := router.Group("/alimentos")
	alimentos.Use(authMiddleware.ValidateToken)

	alimentos.GET("/", alimentoHandler.GetAlimentos)
	alimentos.GET("/:id", alimentoHandler.GetAlimento)
	alimentos.POST("/", alimentoHandler.PostAlimento)
	alimentos.PUT("/:id", alimentoHandler.PutAlimento)
	alimentos.DELETE("/:id", alimentoHandler.DeleteAlimento)
	alimentos.GET("/below_minimum", alimentoHandler.GetAlimentosBelowMinimum)

	/*
		recetas := router.Group("/recetas")
		recetas.Use(authMiddleware)
	*/

	compras := router.Group("/compras")
	compras.Use(authMiddleware.ValidateToken)

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

	var userClient = clients.NewAuthClient()
	userService := services.NewUserService(userClient)
	userHandler = handlers.NewUserHandler(userService)

}
