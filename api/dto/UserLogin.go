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
		messages = append(messages, *NewDefaultRequestMessage(RequiredUsername))
	}
	if login.Password == "" {
		messages = append(messages, *NewDefaultRequestMessage(RequiredPassword))
	}
	return messages
}
