package responses

type UserLoginInfo struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
	Username    string `json:"username"`
	Codigo      string `json:"codigo"`
	Rol         string `json:"rol"`
	Issued      string `json:".issued"`
	Expires     string `json:".expires"`
}
