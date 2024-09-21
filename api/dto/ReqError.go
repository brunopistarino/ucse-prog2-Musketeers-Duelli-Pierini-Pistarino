package dto

import (
	"errors"
	"net/http"
	"strconv"
)

type ReqError struct {
	StatusCode int              `json:"status_code"`
	Msg        []RequestMessage `json:"msg"`
}

func (e ReqError) Error() string {
	return "status_code: " + strconv.Itoa(e.StatusCode) + ", msg: " + e.Msg[0].Description
}

func NewReqError(statusCode int, id int, err error) *ReqError {
	return &ReqError{
		StatusCode: statusCode,
		Msg: []RequestMessage{
			{
				ID:          id,
				Description: err.Error(),
			},
		},
	}
}

func NewReqErrorWithMessages(statusCode int, messages []RequestMessage) *ReqError {
	return &ReqError{
		StatusCode: statusCode,
		Msg:        messages,
	}
}

func (e ReqError) HasMessages() bool {
	return len(e.Msg) > 0
}

func (e ReqError) HasStatusCode() bool {
	return e.StatusCode != 0
}

func (e ReqError) IsDefined() bool {
	return e.HasMessages() || e.HasStatusCode()
}

func BadRequestError(err error) *ReqError {
	return NewReqError(http.StatusBadRequest, http.StatusBadRequest, err)
}

func BindBadRequestError() *ReqError {
	return NewReqError(http.StatusBadRequest, 40090, errors.New("request body not valid"))
}

func UnauthorizedError(id int, err error) *ReqError {
	return NewReqError(http.StatusUnauthorized, id, err)
}

func ForbiddenError(err error) *ReqError {
	return NewReqError(http.StatusForbidden, http.StatusForbidden, err)
}

func NotFoundError(err error) *ReqError {
	return NewReqError(http.StatusNotFound, http.StatusNotFound, err)
}

func InternalServerError(err error) *ReqError {
	return NewReqError(http.StatusInternalServerError, http.StatusInternalServerError, err)
}

func LoginError(err error) *ReqError {
	if err.Error() == "invalid_grant" {
		return NewReqError(http.StatusBadRequest, 40080, errors.New("incorrect username or password"))
	}
	return NewReqError(http.StatusBadRequest, 40081, errors.New("unsupported_grant_type"))
}

func RegisterError(err error) *ReqError {
	return NewReqError(http.StatusBadRequest, 40082, err)
}
