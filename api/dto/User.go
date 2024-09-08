package dto

import "api/clients/responses"

type User struct {
	Codigo   string `json:codigo`
	Email    string `json:email`
	Username string `json:username`
}

func NewUser(userInfo *responses.UserInfo) User {
	user := User{}
	if userInfo != nil {
		user.Codigo = userInfo.Codigo
		user.Email = userInfo.Email
		user.Username = userInfo.Username
	}
	return user
}
