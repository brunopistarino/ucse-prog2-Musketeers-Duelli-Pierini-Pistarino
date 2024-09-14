package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Alimento struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty"` //omitempty agrega el campo solo si no es nil
	CodigoUsuario      string             `bson:"codigo_usuario"`
	Nombre             string             `bson:"nombre"`
	Tipo               string             `bson:"tipo"`
	Momentos           []string           `bson:"momentos"`
	Precio             float32            `bson:"precio"`
	CantidadActual     int                `bson:"cantidad_actual"`
	CantidadMinima     int                `bson:"cantidad_minima"`
	FechaCreacion      primitive.DateTime `bson:"fecha_creacion"`
	FechaActualizacion primitive.DateTime `bson:"fecha_actualizacion"`
}
