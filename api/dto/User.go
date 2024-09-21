package dto

import "api/clients/responses"

type User struct {
	Code     string `json:"codigo"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Role     string `json:"rol"`
}

func NewUser(userInfo *responses.UserInfo) User {
	user := User{}
	if userInfo != nil {
		user.Code = userInfo.Code
		user.Email = userInfo.Email
		user.Username = userInfo.Username
		user.Role = userInfo.Role
	}
	return user
}
