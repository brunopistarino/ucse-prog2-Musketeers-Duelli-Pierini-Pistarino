package services

import (
	"api/clients"
	"api/clients/responses"
	"api/dto"
	"net/http"
)

type UserInterface interface {
	LoginUser(user *dto.UserLogin) (*responses.UserLoginInfo, dto.ReqError)
	RegisterUser(user *dto.UserRegister) dto.ReqError
}

type UserService struct {
	authClient clients.AuthClientInterface
}

func NewUserService(authClient clients.AuthClientInterface) *UserService {
	return &UserService{
		authClient: clients.NewAuthClient(),
	}
}

func (service UserService) LoginUser(user *dto.UserLogin) (*responses.UserLoginInfo, dto.ReqError) {
	messages := user.VerifyLogin()

	if len(messages) > 0 {
		return nil, *dto.NewReqErrorWithMessages(http.StatusUnprocessableEntity, messages)
	}

	response, err := service.authClient.PostLoginUser(user)

	if err != nil && err.Error() == "500" {
		return nil, *dto.InternalServerError(err)
	}
	if err != nil {
		return nil, *dto.LoginError(err)
	}

	return response, dto.ReqError{}
}

func (service UserService) RegisterUser(user *dto.UserRegister) dto.ReqError {
	messages := user.VerifyRegister()

	if len(messages) > 0 {
		return *dto.NewReqErrorWithMessages(http.StatusUnprocessableEntity, messages)
	}

	err := service.authClient.PostRegisterUser(user)

	if err != nil {
		return *dto.BadRequestError(err)
	}

	return dto.ReqError{}
}
