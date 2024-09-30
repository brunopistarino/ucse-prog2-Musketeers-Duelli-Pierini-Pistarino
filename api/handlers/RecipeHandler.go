package handlers

import (
	"api/dto"
	"api/services"
	"api/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RecipeHandler struct {
	recipeService services.RecipeInterface
}

func NewRecipeHandler(recipeService services.RecipeInterface) *RecipeHandler {
	return &RecipeHandler{
		recipeService: recipeService,
	}
}

func (handler *RecipeHandler) GetRecipes(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))

	log.Printf("[handler:RecipeHandler][method:GetRecipes][info:GET_ALL][user:%s]", user.Username)
	recipes, err := handler.recipeService.GetRecipes(user.Code)

	if err.IsDefined() {
		log.Printf("[handler:RecipeHandler][method:GetRecipes][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:RecipeHandler][method:GetRecipes][reason:SUCCESS_GET][recipes:%d]", len(recipes))
	c.JSON(200, recipes)
}

func (handler *RecipeHandler) GetRecipe(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:RecipeHandler][method:GetRecipe][info:GET_ONE]")

	id := c.Param("id")
	recipe, err := handler.recipeService.GetRecipe(user.Code, id)

	if err.IsDefined() {
		log.Printf("[handler:RecipeHandler][method:GetRecipe][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	log.Printf("[handler:RecipeHandler][method:GetRecipe][reason:SUCCESS_GET][recipe:%s]", recipe.Name)
	c.JSON(http.StatusOK, recipe)
}

func (handler *RecipeHandler) PostRecipe(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:RecipeHandler][method:PostRecipe][info:POST]")

	var recipe dto.Recipe
	err := c.ShouldBindJSON(&recipe)
	if err != nil {
		log.Printf("[handler:RecipeHadler][method:PostRecipe][reason:ERROR_BIND][error:%s]", err.Error())
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}

	errorService := handler.recipeService.PostRecipe(user.Code, &recipe)

	if errorService.IsDefined() {
		log.Printf("[handler:RecipeHandler][method:PostRecipe][reason:ERROR_PUT][error:%s]", errorService.Error())
		c.JSON(errorService.StatusCode, errorService)
		return
	}

	log.Printf("[handler:RecipeHandler][method:PostRecipe][reason:SUCCESS_PUT][recipe:%s]", recipe.Name)
	c.JSON(http.StatusCreated, recipe)
}

func (handler *RecipeHandler) PostRepeatedRecipe(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))

	log.Print("[handler:RecipeHandler][method:PostRecipe][info:POST]")
	// Bind the recipe id from the URL
	id := c.Param("id")

	if id == "" {
		log.Printf("[handler:RecipeHandler][method:PostRecipe][reason:ERROR_BIND][error:%s]", "id is required")
		c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
		return
	}

	// Get the recipe from the database
	recipe, err := handler.recipeService.GetRecipe(user.Code, id)
	if err.IsDefined() {
		log.Printf("[handler:RecipeHandler][method:PostRecipe][reason:ERROR_GET][error:%s]", err.Error())
		c.JSON(err.StatusCode, err)
		return
	}
	recipe.ID = ""
	// Post recipe to the database
	errorService := handler.recipeService.PostRecipe(user.Code, recipe)

	if errorService.IsDefined() {
		log.Printf("[handler:RecipeHandler][method:PostRecipe][reason:ERROR_PUT_REPEATED][error:%s]", errorService.Error())
		c.JSON(errorService.StatusCode, errorService)
		return
	}

	log.Printf("[handler:RecipeHandler][method:PostRecipe][reason:SUCCESS_PUT_REPEATED][recipe:%s]", recipe.Name)
	c.JSON(http.StatusCreated, recipe)
}

/*
	func (handler *RecipeHandler) PutRecipe(c *gin.Context) {
		user := dto.NewUser(utils.GetUserInfoFromContext(c))
		log.Print("[handler:RecipeHandler][method:PutRecipe][info:PUT]")

		var recipe dto.Recipe
		err := c.ShouldBindJSON(&recipe)
		if err != nil {
			log.Printf("[handler:RecipeHandler][method:PutRecipe][reason:ERROR_BIND][error:%s]", err.Error())
			c.JSON(http.StatusBadRequest, dto.BindBadRequestError())
			return
		}
		id := c.Param("id")

		errorService := handler.recipeService.PutRecipe(user.Code, &recipe, id)

		if errorService.IsDefined() {
			log.Printf("[handler:RecipeHandler][method:PutRecipe][reason:ERROR_PUT][error:%s]", errorService.Error())
			c.JSON(errorService.StatusCode, errorService)
			return
		}

		log.Printf("[handler:RecipeHandler][method:PutRecipe][reason:SUCCESS_PUT][recipe:%s]", recipe.Name)
		c.JSON(http.StatusOK, recipe)
	}
*/
func (handler *RecipeHandler) DeleteRecipe(c *gin.Context) {
	user := dto.NewUser(utils.GetUserInfoFromContext(c))
	log.Print("[handler:RecipeHandler][method:DeleteRecipe][info:DELETE]")

	id := c.Param("id")
	errorService := handler.recipeService.DeleteRecipe(user.Code, id)

	if errorService.IsDefined() {
		log.Printf("[handler:RecipeHandler][method:DeleteRecipe][reason:ERROR_DELETE][error:%s]", errorService.Error())
		c.JSON(errorService.StatusCode, errorService)
		return
	}

	log.Printf("[handler:RecipeHandler][method:DeleteRecipe][reason:SUCCESS_DELETE][id:%s]", id)
	c.JSON(http.StatusOK, dto.DeleteResponse{
		Message:    "Recipe deleted",
		ResourceID: id,
	})
}
