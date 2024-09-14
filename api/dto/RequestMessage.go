package dto

type RequestMessage struct {
	ID          int    `json:"msg_id"`
	Description string `json:"description"`
}

func NewRequestMessage(id int, description string) *RequestMessage {
	return &RequestMessage{
		ID:          id,
		Description: description,
	}
}
