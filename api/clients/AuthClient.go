package clients

import (
	"api/clients/responses"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"time"
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
	apiUrl := "http://w230847.ferozo.com/tp_prog2/api/Account/UserInfo"

	client := &http.Client{
		Transport: auth.SetTransport(),
		Timeout:   20 * time.Second,
	}

	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		log.Printf("[client:AuthClient][method:GetUserInfo][reason:ERROR_GET][error:%s]", err.Error())
		return nil, err
	}

	req.Header.Add("Authorization", token)

	response, err := client.Do(req)
	if err != nil {
		if os.IsTimeout(err) {
			log.Printf("[client:AuthClient][method:GetUserInfo][reason:ERROR_GET][error:%s]", err.Error())
			return nil, err
		}
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

	bodyString := string(responseBody)

	var userInfo responses.UserInfo

	if err := json.Unmarshal([]byte(bodyString), &userInfo); err != nil {
		log.Printf("[client:AuthClient][method:GetUserInfo][reason:ERROR_GET][error:%s]", err.Error())
		return nil, err
	}

	log.Printf("[client:AuthClient][method:GetUserInfo][reason:SUCCESS_GET][status:%d]", response.StatusCode)

	return &userInfo, nil
}

func (auth *AuthClient) SetTransport() *http.Transport {
	// Set up custom transport with timeouts
	return &http.Transport{
		DialContext: (&net.Dialer{
			Timeout: 15 * time.Second,
		}).DialContext,
		TLSHandshakeTimeout:   15 * time.Second,
		ResponseHeaderTimeout: 20 * time.Second,
		IdleConnTimeout:       50 * time.Second,
	}
}
