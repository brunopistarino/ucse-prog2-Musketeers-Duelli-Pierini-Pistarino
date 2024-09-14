package middlewares

import (
	"api/clients"
	"api/dto"
	"api/utils"
	"errors"

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
	//Se obtiene el header necesario con nombre "Authorization"
	authToken := c.GetHeader("Authorization")

	if authToken == "" {
		err := dto.UnauthorizedError(490, errors.New("token not provided"))
		//log.Printf("[service:AulaService][method:ObtenerAulaPorId][reason:NOT_FOUND][id:%s]", id)
		c.AbortWithStatusJSON(err.StatusCode, err)
		return
	}

	//Obtener la informacion del usuario a partir del token desde el servicio externo
	user, err := auth.authClient.GetUserInfo(authToken)
	if err != nil {
		err := dto.UnauthorizedError(491, errors.New("authorization has been denied for this request"))
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
