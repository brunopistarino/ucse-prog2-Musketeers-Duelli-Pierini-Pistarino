package middlewares

import (
	"api/clients"
	"api/dto"
	"api/utils"

	"github.com/gin-gonic/gin"
)

type AuthMiddleware struct {
	authClient clients.AuthClientInterface
}

func NewAuthMiddleware(authClient clients.AuthClientInterface) *AuthMiddleware {
	return &AuthMiddleware{
		authClient: authClient,
	}
}

// Este middleware se ejecuta en el grupo de rutas privadas.
func (auth *AuthMiddleware) ValidateToken(c *gin.Context) {
	//Se obtiene el header necesario con name "Authorization"
	authToken := c.GetHeader("Authorization")

	if authToken == "" {
		err := dto.UnauthorizedError(dto.RequiredToken)
		c.AbortWithStatusJSON(err.StatusCode, err)
		return
	}

	//Obtener la informacion del user a partir del token desde el servicio externo
	user, err := auth.authClient.GetUserInfo(authToken)
	if err != nil {
		err := dto.UnauthorizedError(dto.DeniedAuthorization)
		c.AbortWithStatusJSON(err.StatusCode, err)
		return
	}

	//Role detection not implemented
	// if user.Role != "ADMIN" {
	// 	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
	// 	return
	// }

	//User set in context
	utils.SetUserInContext(c, user)

	c.Next()
}
