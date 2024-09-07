package services

type AlimentoInterface interface {
	Ping() bool
}

type AlimentoService struct {
}

func NewAlimentoService() *AlimentoService {
	return &AlimentoService{}
}

func (service *AlimentoService) Ping() bool {
	return true
}
