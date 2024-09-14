package clients

import (
	"api/clients/responses"
	"api/dto"
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
)

type AuthClientInterface interface {
	PostLoginUser(user *dto.UserLogin) (*responses.UserLoginInfo, error)
	PostRegisterUser(user *dto.UserRegister) error
	GetUserInfo(token string) (*responses.UserInfo, error)
}

type AuthClient struct {
}

func NewAuthClient() *AuthClient {
	return &AuthClient{}
}

func (auth *AuthClient) PostLoginUser(user *dto.UserLogin) (*responses.UserLoginInfo, error) {
	apiUrl := "http://w230847.ferozo.com/tp_prog2/api/account/login"

	client := &http.Client{}

	form := url.Values{}
	form.Add("grant_type", "password")
	form.Add("username", user.Username)
	form.Add("password", user.Password)

	body := bytes.NewBufferString(form.Encode())

	req, err := http.NewRequest("POST", apiUrl, body)
	if err != nil {
		log.Printf("[client:AuthClient][method:PostLoginUser][reason:ERROR_POST][error:%s]", err.Error())
		return nil, err
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response, err := client.Do(req)
	if err != nil {
		log.Printf("[client:AuthClient][method:PostLoginUser][reason:ERROR_POST][error:%s]", err.Error())
		return nil, err
	}
	if response.StatusCode != 200 {
		log.Printf("[client:AuthClient][method:PostLoginUser][reason:ERROR_POST][error:%s]", response.Status)
		return loginError(response)
	}

	defer response.Body.Close()

	// Lee el cuerpo de la respuesta como una cadena
	responseBody, err := io.ReadAll(response.Body)
	if err != nil {
		log.Printf("[client:AuthClient][method:PostLoginUser][reason:ERROR_POST][error:%s]", err.Error())
		return nil, err
	}

	// Convierte el cuerpo de la respuesta a una cadena
	bodyString := string(responseBody)

	var login responses.UserLoginInfo

	if err := json.Unmarshal([]byte(bodyString), &login); err != nil {
		log.Printf("[client:AuthClient][method:PostLoginUser][reason:ERROR_POST][error:%s]", err.Error())
		return nil, err
	}

	log.Printf("[client:AuthClient][method:PostLoginUser][reason:SUCCESS_POST][status:%d]", response.StatusCode)
	return &login, nil
}

func loginError(response *http.Response) (*responses.UserLoginInfo, error) {

	switch response.StatusCode {
	case 400:
		var loginError responses.LoginError
		responseBody, err := io.ReadAll(response.Body)
		if err != nil {
			log.Printf("[client:AuthClient][method:PostLoginUser][reason:ERROR_POST][error:%s]", err.Error())
			return nil, err
		}
		bodyString := string(responseBody)
		if err := json.Unmarshal([]byte(bodyString), &loginError); err != nil {
			log.Printf("[client:AuthClient][method:PostLoginUser][reason:ERROR_POST][error:%s]", err.Error())
			return nil, err
		}
		return nil, errors.New(loginError.Error)
	default:
		return nil, errors.New("500")
	}
}

func (auth *AuthClient) PostRegisterUser(user *dto.UserRegister) error {
	apiUrl := "http://w230847.ferozo.com/tp_prog2/api/account/register"

	client := &http.Client{}

	form := url.Values{}
	form.Add("email", user.Email)
	form.Add("password", user.Password)
	form.Add("ConfirmPassword", user.ConfirmPassword)
	form.Add("Role", "OPERADOR") // Default

	body := bytes.NewBufferString(form.Encode())

	req, err := http.NewRequest("POST", apiUrl, body)
	if err != nil {
		log.Printf("[client:AuthClient][method:PostRegisterUser][reason:ERROR_POST][error:%s]", err.Error())
		return err
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response, err := client.Do(req)
	if err != nil {
		log.Printf("[client:AuthClient][method:PostRegisterUser][reason:ERROR_POST][error:%s]", err.Error())
		return err
	}
	if response.StatusCode != 200 {
		log.Printf("[client:AuthClient][method:PostRegisterUser][reason:ERROR_POST][error:%s]", response.Status)
		return errors.New(strconv.Itoa(response.StatusCode))
	}

	defer response.Body.Close()

	log.Printf("[client:AuthClient][method:PostRegisterUser][reason:SUCCESS_POST]")
	return nil

}

func (auth *AuthClient) GetUserInfo(token string) (*responses.UserInfo, error) {
	apiUrl := "http://w230847.ferozo.com/tp_prog2/api/Account/UserInfo"

	client := &http.Client{}

	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		log.Printf("[client:AuthClient][method:GetUserInfo][reason:ERROR_GET][error:%s]", err.Error())
		return nil, err
	}

	req.Header.Add("Authorization", token)

	response, err := client.Do(req)
	if err != nil {
		log.Printf("[client:AuthClient][method:GetUserInfo][reason:ERROR_GET][error:%s]", err.Error())
		return nil, err
	}

	defer response.Body.Close()
	responseBody, err := io.ReadAll(response.Body)
	if response.StatusCode != 200 {
		log.Printf("[client:AuthClient][method:GetUserInfo][reason:ERROR_GET][error:%s]", response.Status)
		return nil, errors.New("error getting user info")
	}

	if err != nil {
		log.Printf("[client:AuthClient][method:GetUserInfo][reason:ERROR_GET][error:%s]", err.Error())
		return nil, err
	}

	// Convierte el cuerpo de la respuesta a una cadena
	bodyString := string(responseBody)

	var userInfo responses.UserInfo

	if err := json.Unmarshal([]byte(bodyString), &userInfo); err != nil {
		log.Printf("[client:AuthClient][method:GetUserInfo][reason:ERROR_GET][error:%s]", err.Error())
		return nil, err
	}

	log.Printf("[client:AuthClient][method:GetUserInfo][reason:SUCCESS_GET][status:%d]", response.StatusCode)

	return &userInfo, nil
}
