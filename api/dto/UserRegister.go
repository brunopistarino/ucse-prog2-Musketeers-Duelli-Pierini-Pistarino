package dto

import "api/utils"

type UserRegister struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
}

func NewUserRegister(email string, password string, confirmPassword string) *UserRegister {
	return &UserRegister{
		Email:           email,
		Password:        password,
		ConfirmPassword: confirmPassword,
	}
}

func (register UserRegister) VerifyRegister() []RequestMessage {
	var messages []RequestMessage
	if register.Email == "" {
		messages = append(messages, *NewRequestMessage(470, "email is required"))
	}
	// Email validation
	if !utils.IsValidEmail(register.Email) {
		messages = append(messages, *NewRequestMessage(471, "email is not valid"))
	}
	if register.Password == "" {
		messages = append(messages, *NewRequestMessage(472, "password is required"))
	}
	if len(register.Password) < 6 {
		messages = append(messages, *NewRequestMessage(473, "password must be at least 6 characters long"))
	}
	if !utils.FindUpperNumberSpecialChar(register.Password) {
		messages = append(messages, *NewRequestMessage(474, "password must have at least one non letter character, one digit character ('0'-'9') and one uppercase character ('A'-'Z')"))
	}
	if register.ConfirmPassword == "" {
		messages = append(messages, *NewRequestMessage(475, "confirm_password is required"))
	}
	if register.Password != register.ConfirmPassword {
		messages = append(messages, *NewRequestMessage(476, "passwords do not match"))
	}
	return messages
}
