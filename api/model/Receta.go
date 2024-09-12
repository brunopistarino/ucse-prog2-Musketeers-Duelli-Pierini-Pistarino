package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Receta struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"` //omitempty agrega el campo solo si no es nil
	Nombre       string             `bson:"nombre"`
	Momento      string             `bson:"momento"`
	Ingredientes []struct {
		Alimento primitive.ObjectID `bson:"alimento"`
		Cantidad int                `bson:"cantidad"`
	}
	FechaCreacion      primitive.DateTime `bson:"fecha_creacion"`
	FechaActualizacion primitive.DateTime `bson:"fecha_ctualizacion"`
}
