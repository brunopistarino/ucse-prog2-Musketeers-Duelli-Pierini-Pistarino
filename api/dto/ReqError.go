package dto

import (
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

func UnauthorizedError(err error) *ReqError {
	return NewReqError(http.StatusUnauthorized, http.StatusUnauthorized, err)
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
