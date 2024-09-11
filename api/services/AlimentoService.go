package services

import (
	"api/dto"
	"api/repositories"
	"api/utils"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AlimentoInterface interface {
	GetAlimentos() ([]*dto.Alimento, error)
	GetAlimentosBelowMinimum(foodType string, name string) ([]*dto.Alimento, error)
	GetAlimento(id string) (*dto.Alimento, error)
	PostAlimento(alimento *dto.Alimento) error
	PutAlimento(alimento *dto.Alimento, id string) error
	DeleteAlimento(id string) error
}

type AlimentoService struct {
	AlimentoRepository repositories.AlimentoRepositoryInterface
}

func NewAlimentoService(alimentoRepository repositories.AlimentoRepositoryInterface) *AlimentoService {
	return &AlimentoService{
		AlimentoRepository: alimentoRepository,
	}
}

func (service *AlimentoService) GetAlimentos() ([]*dto.Alimento, error) {
	alimentosDB, err := service.AlimentoRepository.GetAlimentos()

	if err != nil {
		return nil, err
	}

	var alimentos []*dto.Alimento
	for _, alimentoDB := range alimentosDB {
		alimento := dto.NewAlimento(alimentoDB)
		alimentos = append(alimentos, alimento)
	}
	if len(alimentos) == 0 {
		alimentos = []*dto.Alimento{}
	}
	return alimentos, nil
}

func (service *AlimentoService) GetAlimento(id string) (*dto.Alimento, error) {
	alimentoDB, err := service.AlimentoRepository.GetAlimento(id)

	if err != nil {
		return nil, err
	}

	alimento := dto.NewAlimento(alimentoDB)
	return alimento, nil
}

func (service *AlimentoService) PostAlimento(alimento *dto.Alimento) error {

	err := alimento.VerifyAlimento()
	if err != nil {
		return err
	}

	alimentoDB := alimento.GetModel()

	now := time.Now()

	alimentoDB.FechaCreacion = primitive.NewDateTimeFromTime(now)
	alimentoDB.FechaActualizacion = primitive.NewDateTimeFromTime(time.Time{})
	insertOneResult, err := service.AlimentoRepository.PostAlimento(alimentoDB)
	resultID := insertOneResult.InsertedID.(primitive.ObjectID)

	if err != nil {
		return err
	}
	alimento.ID = utils.GetStringIDFromObjectID(resultID)
	return nil
}

func (service *AlimentoService) PutAlimento(alimento *dto.Alimento, id string) error {
	err := alimento.VerifyAlimento()
	if err != nil {
		return err
	}
	if id == "" {
		return errors.New("id is required")
	}

	alimentoDB := alimento.GetModel()
	now := time.Now()
	alimentoDB.FechaActualizacion = primitive.NewDateTimeFromTime(now)

	updateResult, err := service.AlimentoRepository.PutAlimento(alimentoDB)
	if err != nil {
		return err
	}
	if updateResult.MatchedCount == 0 {
		return errors.New("NF")
	}
	return nil
}

func (service *AlimentoService) DeleteAlimento(id string) error {
	objectID := utils.GetObjectIDFromStringID(id)

	_, err := service.AlimentoRepository.DeleteAlimento(objectID)
	if err != nil {
		return err
	}
	return nil
}

func (service *AlimentoService) GetAlimentosBelowMinimum(foodType string, name string) ([]*dto.Alimento, error) {

	if foodType != "" && !utils.StringExistsInSlice(foodType, dto.FoodType) {
		return nil, errors.New("invalid alimento type")
	}

	alimentosDB, err := service.AlimentoRepository.GetAlimentosBelowMinimum(foodType, name)

	if err != nil {
		return nil, err
	}

	var alimentos []*dto.Alimento
	for _, alimentoDB := range alimentosDB {
		alimento := dto.NewAlimento(alimentoDB)
		alimentos = append(alimentos, alimento)
	}
	if len(alimentos) == 0 {
		alimentos = []*dto.Alimento{}
	}
	return alimentos, nil
}
