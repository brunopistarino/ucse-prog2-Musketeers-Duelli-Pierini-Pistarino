package dto

type UserLogin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func NewUserLogin(username string, password string) *UserLogin {
	return &UserLogin{
		Username: username,
		Password: password,
	}
}

func (login UserLogin) VerifyLogin() []RequestMessage {
	var messages []RequestMessage
	if login.Username == "" {
		messages = append(messages, *NewRequestMessage(477, "username is required"))
	}
	if login.Password == "" {
		messages = append(messages, *NewRequestMessage(478, "password is required"))
	}
	return messages
}
