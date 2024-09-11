package services

import (
	"api/dto"
	"api/model"
	"api/repositories"
	"api/utils"
	"errors"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CompraInterface interface {
	GetCompras() ([]*dto.Compra, error)
	PostCompra(ids []string) (*dto.Compra, error)
}

type CompraService struct {
	AlimentoRepository repositories.AlimentoRepositoryInterface
	CompraRepository   repositories.CompraRepositoryInterface
}

func NewCompraService(alimentoRepository repositories.AlimentoRepositoryInterface, compraRepository repositories.CompraRepositoryInterface) *CompraService {
	return &CompraService{
		AlimentoRepository: alimentoRepository,
		CompraRepository:   compraRepository,
	}
}

func (service *CompraService) GetCompras() ([]*dto.Compra, error) {
	comprasDB, err := service.CompraRepository.GetCompras()

	if err != nil {
		return nil, err
	}

	var compras []*dto.Compra
	for _, compraDB := range comprasDB {
		compra := dto.NewCompra(compraDB)
		compras = append(compras, compra)
	}
	if len(compras) == 0 {
		compras = []*dto.Compra{}
	}
	return compras, nil
}

func (service *CompraService) PostCompra(ids []string) (*dto.Compra, error) {
	var alimentosDB []model.Alimento
	if len(ids) != 0 {
		log.Printf("[service:CompraService][method:PostCompra][info:POST][ids:%v]", ids)
		for _, id := range ids {
			alimentoDB, err := service.AlimentoRepository.GetAlimento(id)
			if err != nil {
				return nil, err
			}

			alimentosDB = append(alimentosDB, alimentoDB)
		}
	} else {
		results, err := service.AlimentoRepository.GetAlimentosBelowMinimum("", "")
		if err != nil {
			return nil, err
		}
		if len(results) == 0 {
			return nil, errors.New("no 'alimentos' to buy")
		}
		alimentosDB = results
	}

	total, err := service.AlimentoRepository.SetAlimentosQuantityToMinimum(alimentosDB)

	if err != nil {
		return nil, err
	}

	if total == 0 {
		return nil, errors.New("no 'alimentos' to buy")
	}

	compraDB := model.Compra{
		CostoTotal:         total,
		FechaCreacion:      utils.GetPrimitiveDateTimeFromDate(time.Now()),
		FechaActualizacion: primitive.NewDateTimeFromTime(time.Time{}),
	}

	insertOneResult, err := service.CompraRepository.PostCompra(compraDB)

	if err != nil {
		return nil, err
	}

	compraDB.ID = insertOneResult.InsertedID.(primitive.ObjectID)

	compra := dto.NewCompra(compraDB)

	return compra, nil
}
