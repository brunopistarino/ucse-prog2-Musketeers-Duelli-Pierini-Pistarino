package dto

import (
	"api/model"
	"api/utils"
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
	ID             string   `json:"id" binding:"omitempty"`
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

func (alimento Alimento) VerifyAlimento() []RequestMessage {
	var errs []RequestMessage
	if alimento.ID != "" {
		errs = append(errs, RequestMessage{ID: 461, Description: "request body id must not be set"})
	}
	if alimento.Nombre == "" {
		errs = append(errs, RequestMessage{ID: 462, Description: "nombre is required"})
	} else if len(alimento.Nombre) < 2 || len(alimento.Nombre) > 50 {
		errs = append(errs, RequestMessage{ID: 463, Description: "nombre must be between 2 and 50 characters"})
	}

	if alimento.Tipo == "" {
		errs = append(errs, RequestMessage{ID: 464, Description: "tipo is required"})
	} else if !utils.StringExistsInSlice(alimento.Tipo, FoodType) {
		errs = append(errs, RequestMessage{ID: 465, Description: "tipo is invalid. '" + alimento.Tipo + "' is not a valid food type. Must be one of: " + utils.SliceToString(FoodType)})
	}

	if len(alimento.Momentos) == 0 {
		errs = append(errs, RequestMessage{ID: 466, Description: "momentos is required"})
	} else if utils.HasDuplicates(alimento.Momentos) {
		errs = append(errs, RequestMessage{ID: 467, Description: "momentos has duplicates"})
	} else {
		for _, momento := range alimento.Momentos {
			if !utils.StringExistsInSlice(momento, Times) {
				errs = append(errs, RequestMessage{ID: 468, Description: "momentos is invalid. '" + momento + "' is not a valid time. Must be one of: " + utils.SliceToString(Times)})
				break
			}
		}
	}

	if alimento.Precio < 0 {
		errs = append(errs, RequestMessage{ID: 459, Description: "precio must be a positive number"})
	}
	if alimento.CantidadActual < 0 {
		errs = append(errs, RequestMessage{ID: 460, Description: "cantidad_actual must be a positive number"})
	}
	if alimento.CantidadMinima < 0 {
		errs = append(errs, RequestMessage{ID: 461, Description: "cantidad_minima must be a positive number"})
	}
	return errs
}
