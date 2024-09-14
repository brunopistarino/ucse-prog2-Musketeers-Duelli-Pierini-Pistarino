package services

import (
	"api/dto"
	"api/repositories"
	"api/utils"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AlimentoInterface interface {
	GetAlimentos(user string) ([]*dto.Alimento, dto.ReqError)
	GetAlimentosBelowMinimum(user string, foodType string, name string) ([]*dto.Alimento, dto.ReqError)
	GetAlimento(user string, id string) (*dto.Alimento, dto.ReqError)
	PostAlimento(user string, alimento *dto.Alimento) dto.ReqError
	PutAlimento(user string, alimento *dto.Alimento, id string) dto.ReqError
	DeleteAlimento(user string, id string) dto.ReqError
}

type AlimentoService struct {
	alimentoRepository repositories.AlimentoRepositoryInterface
}

func NewAlimentoService(alimentoRepository repositories.AlimentoRepositoryInterface) *AlimentoService {
	return &AlimentoService{
		alimentoRepository: alimentoRepository,
	}
}

func (service *AlimentoService) GetAlimentos(user string) ([]*dto.Alimento, dto.ReqError) {
	alimentosDB, err := service.alimentoRepository.GetAlimentos(user)

	if err != nil {
		return nil, *dto.InternalServerError(err)
	}

	var alimentos []*dto.Alimento
	for _, alimentoDB := range alimentosDB {
		alimento := dto.NewAlimento(alimentoDB)
		alimentos = append(alimentos, alimento)
	}
	if len(alimentos) == 0 {
		alimentos = []*dto.Alimento{}
	}
	return alimentos, dto.ReqError{}
}

func (service *AlimentoService) GetAlimento(user string, id string) (*dto.Alimento, dto.ReqError) {
	alimentoDB, err := service.alimentoRepository.GetAlimento(user, id)

	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			return nil, *dto.NotFoundError(fmt.Errorf("alimento with id %v not found", id))
		}
		return nil, *dto.InternalServerError(err)
	}

	alimento := dto.NewAlimento(alimentoDB)
	return alimento, dto.ReqError{}
}

func (service *AlimentoService) PostAlimento(user string, alimento *dto.Alimento) dto.ReqError {

	err := alimento.VerifyAlimento()
	log.Print(err)
	if err != nil {
		return *dto.NewReqErrorWithMessages(http.StatusUnprocessableEntity, err)
	}

	alimentoDB := alimento.GetModel()
	alimentoDB.CodigoUsuario = user
	now := time.Now()

	alimentoDB.FechaCreacion = primitive.NewDateTimeFromTime(now)
	alimentoDB.FechaActualizacion = primitive.NewDateTimeFromTime(time.Time{})
	insertOneResult, errInsert := service.alimentoRepository.PostAlimento(alimentoDB)
	resultID := insertOneResult.InsertedID.(primitive.ObjectID)

	if errInsert != nil {
		return *dto.InternalServerError(errInsert)
	}
	alimento.ID = utils.GetStringIDFromObjectID(resultID)
	return dto.ReqError{}
}

func (service *AlimentoService) PutAlimento(user string, alimento *dto.Alimento, id string) dto.ReqError {
	err := alimento.VerifyAlimento()
	if err != nil {
		return *dto.NewReqErrorWithMessages(http.StatusUnprocessableEntity, err)
	}
	if id == "" {
		return *dto.NewReqError(http.StatusBadRequest, 460, errors.New("id is required"))
	}
	alimento.ID = id
	alimentoDB := alimento.GetModel()
	alimentoDB.CodigoUsuario = user
	now := time.Now()
	alimentoDB.FechaActualizacion = primitive.NewDateTimeFromTime(now)

	updateResult, errInsert := service.alimentoRepository.PutAlimento(alimentoDB)
	if errInsert != nil {
		return *dto.InternalServerError(errInsert)
	}
	if updateResult.MatchedCount == 0 {
		return *dto.NotFoundError(fmt.Errorf("alimento with id %v not found", id))
	}
	return dto.ReqError{}
}

func (service *AlimentoService) DeleteAlimento(user string, id string) dto.ReqError {
	objectID := utils.GetObjectIDFromStringID(id)

	DeleteResult, err := service.alimentoRepository.DeleteAlimento(user, objectID)
	if err != nil {
		return *dto.InternalServerError(err)
	}
	if DeleteResult.DeletedCount == 0 {
		return *dto.NotFoundError(fmt.Errorf("alimento with id %v not found", id))
	}
	return dto.ReqError{}
}

// Used for 'Compras'
func (service *AlimentoService) GetAlimentosBelowMinimum(user string, foodType string, name string) ([]*dto.Alimento, dto.ReqError) {

	if foodType != "" && !utils.StringExistsInSlice(foodType, dto.FoodType) {
		return nil, *dto.NewReqError(http.StatusUnprocessableEntity, 465, errors.New("tipo is invalid. '"+foodType+"' is not a valid food type. Must be one of: "+utils.SliceToString(dto.FoodType)))
	}

	alimentosDB, err := service.alimentoRepository.GetAlimentosBelowMinimum(user, foodType, name)

	if err != nil {
		return nil, *dto.InternalServerError(err)
	}

	var alimentos []*dto.Alimento
	for _, alimentoDB := range alimentosDB {
		alimento := dto.NewAlimento(alimentoDB)
		alimentos = append(alimentos, alimento)
	}
	if len(alimentos) == 0 {
		alimentos = []*dto.Alimento{}
	}
	return alimentos, dto.ReqError{}
}
