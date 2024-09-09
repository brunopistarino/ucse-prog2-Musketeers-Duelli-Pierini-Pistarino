package dto

import (
	"api/model"
	"api/utils"
	"time"
)

type Compra struct {
	ID         string    `json:"id"`
	CostoTotal float32   `json:"costo_total"`
	Fecha      time.Time `json:"fecha"`
}

func NewCompra(compra model.Compra) *Compra {
	return &Compra{
		ID:         utils.GetStringIDFromObjectID(compra.ID),
		CostoTotal: compra.CostoTotal,
		Fecha:      utils.GetDateFromPrimitiveDateTime(compra.Fecha),
	}
}

func (compra Compra) GetModel() model.Compra {
	return model.Compra{
		ID:         utils.GetObjectIDFromStringID(compra.ID),
		CostoTotal: compra.CostoTotal,
		Fecha:      utils.GetPrimitiveDateTimeFromDate(compra.Fecha),
	}
}
