# Musketeers

Integrantes: Duelli Agustín, Pierini Luca y Pistarino Bruno.

---

# SuperCook 2024

## Descripción

**SuperCook 2024** es una aplicación diseñada para gestionar los productos alimenticios de un hogar, las recetas favoritas y generar la lista de compras de los productos necesarios. Facilita la tarea de preparar comidas utilizando los ingredientes disponibles, además de ofrecer funciones para organizar las compras y recetas de manera eficiente.

## Funcionalidades Principales

- **Gestión de Alimentos**: Alta, baja y modificación de alimentos, categorizados por tipo y momento de uso (desayuno, almuerzo, merienda, cena). Incluye validaciones como cantidades mínimas y precios.
- **Gestión de Recetas**: Creación, modificación y eliminación de recetas, asegurando que las cantidades necesarias de los ingredientes estén disponibles. Además, las recetas se validan según el uso de los alimentos (no se puede usar un alimento de desayuno en una receta de cena).
- **Compras Automáticas**: Generación automática de la lista de compras según los alimentos que tengan una cantidad por debajo del mínimo.
- **Reportes**: Generación de reportes sobre el uso de recetas, tipos de alimentos, y costos mensuales de compras.

## Endpoints

### Alimentos

- **CRUD de Alimentos**: Administrar alimentos y sus detalles (nombre, tipo, precio, cantidades).
- **Lista de compras**: Filtrar por productos con cantidades por debajo del mínimo.

### Recetas

- **CRUD de Recetas**: Administrar recetas, verificando la disponibilidad de los ingredientes.
- **Búsqueda de Recetas**: Filtrar recetas por nombre, tipo de alimento, o uso.

### Compras

- **Generación de Compra**: Crea automáticamente una compra con los productos necesarios para reponer los alimentos con cantidades bajas.

### Reportes

- **Reporte de Recetas**: Cantidad de recetas agrupadas por tipo de uso y tipos de alimentos.
- **Reporte de Compras**: Promedio mensual de costos del último año.

## Requisitos Técnicos

- **Backend**: Implementado en Go, siguiendo las mejores prácticas para la API, incluyendo estructura de archivos y manejo de errores tipificados.
- **Base de Datos**: MongoDB, utilizando contenedores Docker.
- **Frontend**: Implementado en Next Js.
- **Autenticación**: Implementación de login y registro, con validación de credenciales y manejo de tokens de autenticación.

## Tecnologías Utilizadas

- **Backend**: Go
- **Frontend**: Next Js
- **Base de Datos**: MongoDB
- **Gráficos**: Librería [Recharts](https://recharts.org)
- **Contenedores**: Docker y Docker Compose

## Instrucciones de Instalación

1. Clona este repositorio:
    ```bash
    git clone https://github.com/brunopistarino/ucse-prog2-Musketeers-Duelli-Pierini-Pistarino.git
    ```
2. Levanta los contenedores utilizando Docker Compose:
    ```bash
    docker-compose up
    ```
3. Accede a la aplicación en el navegador en `http://localhost:3000`.

## Instrucciones de Uso

1. **Inicio de Sesión**: Accede o regístrate en la aplicación.
2. **Gestión de Alimentos**: Agrega, modifica o elimina alimentos desde el panel de alimentos.
3. **Creación de Recetas**: Crea recetas a partir de los alimentos disponibles.
4. **Generación de Lista de Compras**: Obtén una lista de los productos que necesitan reabastecimiento.
5. **Visualización de Reportes**: Visualiza estadísticas sobre el uso de recetas y compras.

