package services

import (
	"api/dto"
	"api/model"
	"api/repositories"
	"api/utils"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CompraInterface interface {
	GetCompras() ([]*dto.Compra, error)
	PostCompra(ids []string) (model.Compra, error)
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
	return compras, nil
}

func (service *CompraService) PostCompra(ids []string) (model.Compra, error) {
	var alimentosDB []model.Alimento
	if len(ids) != 0 {
		log.Printf("[service:CompraService][method:PostCompra][info:POST][ids:%v]", ids)
		for _, id := range ids {
			alimentoDB, err := service.AlimentoRepository.GetAlimento(id)
			if err != nil {
				return model.Compra{}, err
			}

			alimentosDB = append(alimentosDB, alimentoDB)
		}
	} else {
		results, err := service.AlimentoRepository.GetAlimentosBelowMinimum("", "")
		if err != nil {
			return model.Compra{}, err
		}
		alimentosDB = results
	}

	total, err := service.AlimentoRepository.SetAlimentosQuantityToMinimum(alimentosDB)

	if err != nil {
		return model.Compra{}, err
	}

	if total == 0 {
		return model.Compra{}, nil
	}

	compra := model.Compra{
		CostoTotal: total,
		Fecha:      utils.GetPrimitiveDateTimeFromDate(time.Now()),
	}

	insertOneResult, err := service.CompraRepository.PostCompra(compra)

	if err != nil {
		return model.Compra{}, err
	}

	compra.ID = insertOneResult.InsertedID.(primitive.ObjectID)
	return compra, nil
}
