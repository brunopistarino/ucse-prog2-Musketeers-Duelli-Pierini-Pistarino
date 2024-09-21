package responses

type UserInfo struct {
	Code     string `json:"codigo"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Role     string `json:"rol"`
}
