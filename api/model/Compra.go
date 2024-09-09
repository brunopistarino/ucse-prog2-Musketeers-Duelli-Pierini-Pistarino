package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Compra struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"` //omitempty agrega el campo solo si no es nil
	CostoTotal float32            `bson:"costo_total"`
	Fecha      primitive.DateTime `bson:"fecha"`
}
