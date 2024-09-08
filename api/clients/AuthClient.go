package clients

import (
	"api/clients/responses"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

type AuthClientInterface interface {
	GetUserInfo(token string) (*responses.UserInfo, error)
}

type AuthClient struct {
}

func NewAuthClient() *AuthClient {
	return &AuthClient{}
}

func (auth *AuthClient) GetUserInfo(token string) (*responses.UserInfo, error) {
	//Ruta donde apunta esta invocacion
	apiUrl := "http://w220066.ferozo.com/tp_prog2/api/Account/UserInfo"

	// Crear un cliente HTTP
	client := &http.Client{}

	// Crear una solicitud GET
	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		fmt.Println("Error al crear la solicitud GET:", err)
		return nil, err
	}

	// Agregar encabezado personalizado
	req.Header.Add("Authorization", token)

	// Realizar la solicitud GET
	response, err := client.Do(req)
	if err != nil {
		fmt.Println("Error al realizar la solicitud GET:", err)
		return nil, err
	}

	defer response.Body.Close()
	// Lee el cuerpo de la respuesta como una cadena
	responseBody, err := io.ReadAll(response.Body)
	//Si el codigo es distinto de 200, es porque dio un error.
	if response.StatusCode != 200 {
		fmt.Println("Error al realizar la solicitud GET:", responseBody)
		return nil, errors.New("La peticion respondio con error")
	}

	if err != nil {
		fmt.Println("Error al leer el cuerpo de la respuesta:", err)
		return nil, err
	}

	// Convierte el cuerpo de la respuesta a una cadena
	bodyString := string(responseBody)

	var userInfo responses.UserInfo

	if err := json.Unmarshal([]byte(bodyString), &userInfo); err != nil {
		fmt.Println("Error al deserializar el JSON:", err)
		return nil, err
	}

	fmt.Println("Código de estado:", response.Status)

	return &userInfo, nil
}
