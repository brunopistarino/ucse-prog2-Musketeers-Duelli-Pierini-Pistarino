package services

import (
	"api/dto"
	"api/model"
	"api/repositories"
	"api/utils"
	"errors"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CompraInterface interface {
	GetCompras(user string) ([]*dto.Compra, dto.ReqError)
	PostCompra(user string, ids []string) (*dto.Compra, dto.ReqError)
}

type CompraService struct {
	alimentoRepository repositories.AlimentoRepositoryInterface
	CompraRepository   repositories.CompraRepositoryInterface
}

func NewCompraService(alimentoRepository repositories.AlimentoRepositoryInterface, compraRepository repositories.CompraRepositoryInterface) *CompraService {
	return &CompraService{
		alimentoRepository: alimentoRepository,
		CompraRepository:   compraRepository,
	}
}

func (service *CompraService) GetCompras(user string) ([]*dto.Compra, dto.ReqError) {
	comprasDB, err := service.CompraRepository.GetCompras(user)

	if err != nil {
		return nil, *dto.InternalServerError(err)
	}

	var compras []*dto.Compra
	for _, compraDB := range comprasDB {
		compra := dto.NewCompra(compraDB)
		compras = append(compras, compra)
	}
	if len(compras) == 0 {
		compras = []*dto.Compra{}
	}
	return compras, dto.ReqError{}
}

func (service *CompraService) PostCompra(user string, ids []string) (*dto.Compra, dto.ReqError) {
	var alimentosDB []model.Alimento
	if len(ids) != 0 {
		log.Printf("[service:CompraService][method:PostCompra][info:POST][ids:%v]", ids)
		for _, id := range ids {
			alimentoDB, err := service.alimentoRepository.GetAlimento(user, id)
			if err != nil {
				return nil, *dto.NotFoundError(fmt.Errorf("alimento with id %v not found", id))
			}

			alimentosDB = append(alimentosDB, alimentoDB)
		}
	} else {
		results, err := service.alimentoRepository.GetAlimentosBelowMinimum(user, "", "")
		if err != nil {
			return nil, *dto.InternalServerError(err)
		}
		if len(results) == 0 {
			return nil, *dto.NotFoundError(errors.New("unable to proceed with purchase: no food items are below minimum quantity"))
		}
		alimentosDB = results
	}

	total, err := service.alimentoRepository.SetAlimentosQuantityToMinimum(user, alimentosDB)

	if err != nil {
		return nil, *dto.InternalServerError(err)
	}

	if total == 0 {
		return nil, *dto.NotFoundError(errors.New("unable to proceed with purchase: no food items are below minimum quantity"))
	}

	compraDB := model.Compra{
		CostoTotal:         total,
		CodigoUsuario:      user,
		FechaCreacion:      utils.GetPrimitiveDateTimeFromDate(time.Now()),
		FechaActualizacion: primitive.NewDateTimeFromTime(time.Time{}),
	}

	insertOneResult, err := service.CompraRepository.PostCompra(compraDB)

	if err != nil {
		return nil, *dto.InternalServerError(err)
	}

	compraDB.ID = insertOneResult.InsertedID.(primitive.ObjectID)

	compra := dto.NewCompra(compraDB)

	return compra, dto.ReqError{}
}
