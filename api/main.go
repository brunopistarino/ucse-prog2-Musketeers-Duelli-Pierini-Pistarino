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
	foodstuffHandler *handlers.FoodstuffHandler
	recipeHandler    *handlers.RecipeHandler
	purchaseHandler  *handlers.PurchaseHandler
	userHandler      *handlers.UserHandler
	router           *gin.Engine
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

	user := router.Group("/user")
	user.POST("/login", userHandler.LoginUser)
	user.POST("/register", userHandler.RegisterUser)

	foodstuffs := router.Group("/foodstuffs")
	foodstuffs.Use(authMiddleware.ValidateToken)

	foodstuffs.GET("/", foodstuffHandler.GetFoodstuffs)
	foodstuffs.GET("/:id", foodstuffHandler.GetFoodstuff)
	foodstuffs.POST("/", foodstuffHandler.PostFoodstuff)
	foodstuffs.PUT("/:id", foodstuffHandler.PutFoodstuff)
	foodstuffs.DELETE("/:id", foodstuffHandler.DeleteFoodstuff)
	foodstuffs.GET("/below_minimum", foodstuffHandler.GetFoodstuffsBelowMinimum)

	recipes := router.Group("/recipes")
	recipes.Use(authMiddleware.ValidateToken)

	recipes.GET("/", recipeHandler.GetRecipes)
	recipes.GET("/:id", recipeHandler.GetRecipe)
	recipes.POST("/", recipeHandler.PostRecipe)
	//recipes.PUT("/:id", recipeHandler.PutRecipe)
	recipes.DELETE("/:id", recipeHandler.DeleteRecipe)

	purchases := router.Group("/purchases")
	purchases.Use(authMiddleware.ValidateToken)

	purchases.GET("/", purchaseHandler.GetPurchases)
	purchases.POST("/", purchaseHandler.PostPurchase)

	reports := router.Group("/reports")
	reports.Use(authMiddleware.ValidateToken)
	/*
		reports.GET("/foodstuffs", reportHandler.GetReportsByTypeOfUse)
		reports.GET("/recipes", reportHandler.GetReportsByTypeOfFoodstuff)
		reports.GET("/monthly_costs", reportHandler.GetMonthlyCosts)
	*/
}

func dependencies() {
	var database = repositories.NewMongoDB()

	foodstuffRepository := repositories.NewFoodstuffRepository(database)
	purchaseRepository := repositories.NewPurchaseRepository(database)
	recipeRepository := repositories.NewRecipeRepository(database)

	foodstuffService := services.NewFoodstuffService(foodstuffRepository)
	purchaseService := services.NewPurchaseService(foodstuffRepository, purchaseRepository)
	recipeService := services.NewRecipeService(recipeRepository, foodstuffRepository)
	//reportService := services.NewReportService(recipeRepository, purchaseRepository)

	foodstuffHandler = handlers.NewFoodstuffHandler(foodstuffService)
	purchaseHandler = handlers.NewPurchaseHandler(purchaseService)
	recipeHandler = handlers.NewRecipeHandler(recipeService)
	//reportHandler = handlers.NewReportHandler(reportService)

	var userClient = clients.NewAuthClient()
	userService := services.NewUserService(userClient)
	userHandler = handlers.NewUserHandler(userService)

}
