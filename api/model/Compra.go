package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Compra struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty"` //omitempty agrega el campo solo si no es nil
	CodigoUsuario      string             `bson:"codigo_usuario"`
	CostoTotal         float32            `bson:"costo_total"`
	FechaCreacion      primitive.DateTime `bson:"fecha_creacion"`
	FechaActualizacion primitive.DateTime `bson:"fecha_actualizacion"`
}
