package dto

import (
	"api/model"
	"api/utils"
	"errors"
)

// Declare a constant array of types of food.
const (
	Verdura = "Verdura"
	Fruta   = "Fruta"
	Lacteo  = "Lácteo"
	Carne   = "Carne"
	Pescado = "Pescado"
)

var FoodType = []string{
	Verdura,
	Fruta,
	Lacteo,
	Carne,
	Pescado,
}

// Declare a constant array of food 'moments'.
const (
	Desayuno = "Desayuno"
	Almuerzo = "Almuerzo"
	Merienda = "Merienda"
	Cena     = "Cena"
)

var Times = []string{
	Desayuno,
	Almuerzo,
	Merienda,
	Cena,
}

type Alimento struct {
	ID             string   `json:"id"`
	Nombre         string   `json:"nombre"`
	Tipo           string   `json:"tipo"`
	Momentos       []string `json:"momentos"`
	Precio         float32  `json:"precio"`
	CantidadActual int      `json:"cantidad_actual"`
	CantidadMinima int      `json:"cantidad_minima"`
}

func NewAlimento(alimento model.Alimento) *Alimento {
	return &Alimento{
		ID:             utils.GetStringIDFromObjectID(alimento.ID),
		Nombre:         alimento.Nombre,
		Tipo:           alimento.Tipo,
		Momentos:       alimento.Momentos,
		Precio:         alimento.Precio,
		CantidadActual: alimento.CantidadActual,
		CantidadMinima: alimento.CantidadMinima,
	}
}

func (alimento Alimento) GetModel() model.Alimento {
	return model.Alimento{
		ID:             utils.GetObjectIDFromStringID(alimento.ID),
		Nombre:         alimento.Nombre,
		Tipo:           alimento.Tipo,
		Momentos:       alimento.Momentos,
		Precio:         alimento.Precio,
		CantidadActual: alimento.CantidadActual,
		CantidadMinima: alimento.CantidadMinima,
	}
}

func (alimento Alimento) VerifyAlimento() error {
	// Verify all fields are correctly filled
	if alimento.Nombre == "" {
		return errors.New("Nombre is required")
	}
	if alimento.Tipo == "" {
		return errors.New("Tipo is required")
	}
	if !utils.StringExistsInSlice(alimento.Tipo, FoodType) {
		return errors.New("Tipo is invalid. '" + alimento.Tipo + "' is not a valid food type. Must be one of: " + utils.SliceToString(FoodType))
	}
	if len(alimento.Momentos) == 0 {
		return errors.New("Momentos is required")
	}
	for _, momento := range alimento.Momentos {
		if !utils.StringExistsInSlice(momento, Times) {
			return errors.New("Momentos is invalid. '" + momento + "' is not a valid time. Must be one of: " + utils.SliceToString(Times))
		}
	}
	if alimento.Precio < 0 {
		return errors.New("Precio must be a positive number")
	}
	if alimento.CantidadActual < 0 {
		return errors.New("CantidadActual must be a positive number")
	}
	if alimento.CantidadMinima < 0 {
		return errors.New("CantidadMinima must be a positive number")
	}
	return nil
}
