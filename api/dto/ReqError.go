package dto

import (
	"net/http"
	"strconv"
)

type RequestError struct {
	StatusCode int              `json:"status_code"`
	Msg        []RequestMessage `json:"msg"`
}

// Validations
func (e RequestError) Error() string {
	return "status_code: " + strconv.Itoa(e.StatusCode) + ", msg: " + e.Msg[0].Description
}

func (e RequestError) HasMessages() bool {
	return len(e.Msg) > 0
}

func (e RequestError) HasStatusCode() bool {
	return e.StatusCode != 0
}

func (e RequestError) IsDefined() bool {
	return e.HasMessages() || e.HasStatusCode()
}

// Constructors
func NewRequestErrorWithMessages(statusCode int, messages []RequestMessage) *RequestError {
	return &RequestError{
		StatusCode: statusCode,
		Msg:        messages,
	}
}

func NewRequestError(statusCode int, id int) *RequestError {
	return &RequestError{
		StatusCode: statusCode,
		Msg: []RequestMessage{
			*NewDefaultRequestMessage(id),
		},
	}
}

func NewGenericRequestError(statusCode int, id int, message string) *RequestError {
	return &RequestError{
		StatusCode: statusCode,
		Msg: []RequestMessage{
			*NewRequestMessage(id, message),
		},
	}
}

// Errors
func BindBadRequestError() *RequestError {
	return NewRequestError(http.StatusBadRequest, InvalidRequestBody)
}

func UnauthorizedError(id int) *RequestError {
	return NewRequestError(http.StatusUnauthorized, id)
}

func NotFoundError(err error) *RequestError {
	return NewGenericRequestError(http.StatusNotFound, http.StatusNotFound, err.Error())
}

func TimeoutError(err error) *RequestError {
	return NewGenericRequestError(http.StatusGatewayTimeout, http.StatusGatewayTimeout, err.Error())
}
