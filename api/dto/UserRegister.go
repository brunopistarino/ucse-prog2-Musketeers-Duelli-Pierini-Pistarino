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
		messages = append(messages, *NewDefaultRequestMessage(RequiredEmail))
	}
	if !utils.IsValidEmail(register.Email) {
		messages = append(messages, *NewDefaultRequestMessage(InvalidEmail))
	}
	if register.Password == "" {
		messages = append(messages, *NewDefaultRequestMessage(RequiredPassword))
	}
	if len(register.Password) < 6 {
		messages = append(messages, *NewDefaultRequestMessage(InvalidPasswordLength))
	}
	if !utils.FindUpperNumberSpecialChar(register.Password) {
		messages = append(messages, *NewDefaultRequestMessage(InvalidPasswordCharacters))
	}
	if register.ConfirmPassword == "" {
		messages = append(messages, *NewDefaultRequestMessage(RequiredConfirmPassword))
	}
	if register.Password != register.ConfirmPassword {
		messages = append(messages, *NewDefaultRequestMessage(PasswordsDoNotMatch))
	}
	return messages
}
