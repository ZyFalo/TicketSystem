## ADDED Requirements

### Requirement: Toast notification module
El sistema SHALL proveer un módulo `toast.js` que exporte la función `showToast(message, type)` para mostrar notificaciones no-bloqueantes en la interfaz.

#### Scenario: Mostrar toast de éxito
- **WHEN** se invoca `showToast('Cambios guardados', 'success')`
- **THEN** aparece un toast con fondo verde translúcido, texto del mensaje, y se auto-oculta después de 3 segundos

#### Scenario: Mostrar toast de error
- **WHEN** se invoca `showToast('Error al guardar', 'error')`
- **THEN** aparece un toast con fondo rojo translúcido y se auto-oculta después de 4 segundos

#### Scenario: Mostrar toast de info
- **WHEN** se invoca `showToast('Sin cambios', 'info')`
- **THEN** aparece un toast con fondo neutro y se auto-oculta después de 3 segundos

### Requirement: Toast container position
Los toasts SHALL renderizarse en un contenedor fijo posicionado en la esquina superior derecha de la pantalla (`position: fixed; top; right`).

#### Scenario: Múltiples toasts simultáneos
- **WHEN** se disparan varios toasts seguidos
- **THEN** se apilan verticalmente en el contenedor sin solaparse

### Requirement: Toast animation
Cada toast SHALL animarse al entrar (slide-in desde la derecha) y al salir (fade-out). La animación MUST ser CSS pura (`@keyframes`).

#### Scenario: Ciclo de vida del toast
- **WHEN** se crea un toast
- **THEN** se inserta en el DOM con animación de entrada, permanece visible el tiempo definido, ejecuta animación de salida, y se remueve del DOM

### Requirement: Reemplazo de alert()
Todos los `alert()` existentes en el frontend SHALL ser reemplazados por llamadas a `showToast()`. No MUST quedar ningún `alert()` en el código JS.

#### Scenario: Guardar gestión de ticket exitosamente
- **WHEN** el usuario guarda cambios en el detalle del ticket y la API responde OK
- **THEN** se muestra `showToast('Cambios guardados', 'success')` en vez de `alert('Cambios guardados')`

#### Scenario: Error al cambiar estado
- **WHEN** la API retorna error al intentar cambiar estado
- **THEN** se muestra `showToast(errorMessage, 'error')` en vez de `alert(errorMessage)`
