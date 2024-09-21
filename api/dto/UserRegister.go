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
		messages = append(messages, *NewRequestMessage(40070, "email is required"))
	}
	// Email validation
	if !utils.IsValidEmail(register.Email) {
		messages = append(messages, *NewRequestMessage(40071, "email is not valid"))
	}
	if register.Password == "" {
		messages = append(messages, *NewRequestMessage(40072, "password is required"))
	}
	if len(register.Password) < 6 {
		messages = append(messages, *NewRequestMessage(40073, "password must be at least 6 characters long"))
	}
	if !utils.FindUpperNumberSpecialChar(register.Password) {
		messages = append(messages, *NewRequestMessage(40074, "password must have at least one non letter character, one digit character ('0'-'9') and one uppercase character ('A'-'Z')"))
	}
	if register.ConfirmPassword == "" {
		messages = append(messages, *NewRequestMessage(40075, "confirm_password is required"))
	}
	if register.Password != register.ConfirmPassword {
		messages = append(messages, *NewRequestMessage(40076, "passwords do not match"))
	}
	return messages
}
