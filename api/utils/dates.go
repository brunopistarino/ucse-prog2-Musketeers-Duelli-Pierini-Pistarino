package utils

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetDateFromPrimitiveDateTime(primitiveDate primitive.DateTime) time.Time {
	return primitiveDate.Time()
}

func GetPrimitiveDateTimeFromDate(date time.Time) primitive.DateTime {
	return primitive.NewDateTimeFromTime(date)
}
