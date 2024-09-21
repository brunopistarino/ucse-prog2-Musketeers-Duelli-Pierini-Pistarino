package services

import (
	"api/clients"
	"api/clients/responses"
	"api/dto"
	"net/http"
)

type UserInterface interface {
	LoginUser(user *dto.UserLogin) (*responses.UserLoginInfo, dto.RequestError)
	RegisterUser(user *dto.UserRegister) dto.RequestError
}

type UserService struct {
	authClient clients.AuthClientInterface
}

func NewUserService(authClient clients.AuthClientInterface) *UserService {
	return &UserService{
		authClient: clients.NewAuthClient(),
	}
}

func (service UserService) LoginUser(user *dto.UserLogin) (*responses.UserLoginInfo, dto.RequestError) {
	messages := user.VerifyLogin()

	if len(messages) > 0 {
		return nil, *dto.NewRequestErrorWithMessages(http.StatusBadRequest, messages)
	}

	response, err := service.authClient.PostLoginUser(user)

	if err != nil && err.Error() == "500" {
		return nil, *dto.InternalServerError()
	}
	if err != nil {
		return nil, *dto.LoginError(err)
	}

	return response, dto.RequestError{}
}

func (service UserService) RegisterUser(user *dto.UserRegister) dto.RequestError {
	messages := user.VerifyRegister()

	if len(messages) > 0 {
		return *dto.NewRequestErrorWithMessages(http.StatusBadRequest, messages)
	}

	err := service.authClient.PostRegisterUser(user)

	if err != nil && err.Error() == "500" {
		return *dto.InternalServerError()
	}
	if err != nil {
		return *dto.RegisterError(err)
	}

	return dto.RequestError{}
}
