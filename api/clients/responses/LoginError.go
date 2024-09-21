package responses

type LoginError struct {
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description,omitempty"`
}
