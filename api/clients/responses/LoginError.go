package responses

/*
{
    "error": "invalid_grant",
    "error_description": "El nombre de usuario o la contraseña no son correctos."
}
*/

type LoginError struct {
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description,omitempty"`
}
