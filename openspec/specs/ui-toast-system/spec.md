# ui-toast-system Specification

## Purpose
Proveer un sistema de notificaciones no-bloqueantes (toasts) que reemplace todos los `alert()` del frontend, con soporte para mensajes de exito, error e info, animaciones CSS y apilamiento vertical.

## Requirements

### Requirement: Toast notification module
El sistema SHALL proveer un modulo `toast.js` que exporte la funcion `showToast(message, type)` para mostrar notificaciones no-bloqueantes en la interfaz.

#### Scenario: Mostrar toast de exito
- **WHEN** se invoca `showToast('Cambios guardados', 'success')`
- **THEN** aparece un toast con fondo verde translucido, texto del mensaje, y se auto-oculta despues de 3 segundos

#### Scenario: Mostrar toast de error
- **WHEN** se invoca `showToast('Error al guardar', 'error')`
- **THEN** aparece un toast con fondo rojo translucido y se auto-oculta despues de 4 segundos

#### Scenario: Mostrar toast de info
- **WHEN** se invoca `showToast('Sin cambios', 'info')`
- **THEN** aparece un toast con fondo neutro y se auto-oculta despues de 3 segundos

### Requirement: Toast container position
Los toasts SHALL renderizarse en un contenedor fijo posicionado en la esquina superior derecha de la pantalla (`position: fixed; top; right`).

#### Scenario: Multiples toasts simultaneos
- **WHEN** se disparan varios toasts seguidos
- **THEN** se apilan verticalmente en el contenedor sin solaparse

### Requirement: Toast animation
Cada toast SHALL animarse al entrar (slide-in desde la derecha) y al salir (fade-out). La animacion MUST ser CSS pura (`@keyframes`).

#### Scenario: Ciclo de vida del toast
- **WHEN** se crea un toast
- **THEN** se inserta en el DOM con animacion de entrada, permanece visible el tiempo definido, ejecuta animacion de salida, y se remueve del DOM

### Requirement: Reemplazo de alert()
Todos los `alert()` existentes en el frontend SHALL ser reemplazados por llamadas a `showToast()`. No MUST quedar ningun `alert()` en el codigo JS.

#### Scenario: Guardar gestion de ticket exitosamente
- **WHEN** el usuario guarda cambios en el detalle del ticket y la API responde OK
- **THEN** se muestra `showToast('Cambios guardados', 'success')` en vez de `alert('Cambios guardados')`

#### Scenario: Error al cambiar estado
- **WHEN** la API retorna error al intentar cambiar estado
- **THEN** se muestra `showToast(errorMessage, 'error')` en vez de `alert(errorMessage)`
