package responses

type RegisterError struct {
	Message    string              `json:"Message"`
	ModelState map[string][]string `json:"ModelState"`
}
