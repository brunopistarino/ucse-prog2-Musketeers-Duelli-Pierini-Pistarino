package dto

import (
	"api/model"
	"api/utils"
	"time"
)

type Purchase struct {
	ID        string    `json:"id" binding:"omitempty"`
	TotalCost float32   `json:"total_cost"`
	Date      time.Time `json:"date"`
}

func NewPurchase(purchase model.Purchase) *Purchase {
	return &Purchase{
		ID:        utils.GetStringIDFromObjectID(purchase.ID),
		TotalCost: purchase.TotalCost,
		Date:      utils.GetDateFromPrimitiveDateTime(purchase.CreatedAt),
	}
}

func (purchase Purchase) GetModel() model.Purchase {
	return model.Purchase{
		ID:        utils.GetObjectIDFromStringID(purchase.ID),
		TotalCost: purchase.TotalCost,
		CreatedAt: utils.GetPrimitiveDateTimeFromDate(purchase.Date),
	}
}
