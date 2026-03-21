# PROGRAMACIÓN WEB II

## Sistema de Tickets para Soporte Técnico y Revisión de Fragmentos de Código

**Docente:** Javier Ochoa
**Tipo de documento:** Formato de ejecución y explicación del trabajo a realizar
**Proyecto:** Sistema de gestión de solicitudes de soporte
**Fecha:** 16 de marzo de 2026

*Documento elaborado en formato LaTeX para Antigravity*

---

## Índice

1. [Introducción](#1-introducción)
2. [Descripción del proyecto](#2-descripción-del-proyecto)
3. [Objetivo general](#3-objetivo-general)
4. [Objetivos específicos](#4-objetivos-específicos)
5. [Datos generales del trabajo](#5-datos-generales-del-trabajo)
6. [Planteamiento de la necesidad](#6-planteamiento-de-la-necesidad)
7. [Alcance del sistema](#7-alcance-del-sistema)
8. [Funcionalidades principales](#8-funcionalidades-principales)
9. [Requerimientos del sistema](#9-requerimientos-del-sistema)
10. [Tecnologías a utilizar](#10-tecnologías-a-utilizar)
11. [Estructura general del sistema](#11-estructura-general-del-sistema)
12. [Sistema de estados](#12-sistema-de-estados)
13. [Contenido del ticket](#13-contenido-del-ticket)
14. [Módulo de revisión de fragmentos de código](#14-módulo-de-revisión-de-fragmentos-de-código)
15. [Planificación del trabajo](#15-planificación-del-trabajo)
16. [Flujo de funcionamiento del sistema](#16-flujo-de-funcionamiento-del-sistema)
17. [Explicación paso a paso del trabajo a realizar](#17-explicación-paso-a-paso-del-trabajo-a-realizar)
18. [Cuadro resumen del proyecto](#18-cuadro-resumen-del-proyecto)
19. [Entregables](#19-entregables)
20. [Resultados esperados](#20-resultados-esperados)
21. [Conclusiones](#21-conclusiones)
22. [Anexo: resumen ejecutivo](#22-anexo-resumen-ejecutivo)

---

## 1. Introducción

En los entornos académicos, empresariales y de desarrollo de software, es común que los usuarios requieran asistencia técnica para resolver problemas relacionados con sistemas, aplicaciones, errores de funcionamiento o revisión de código. Cuando estas solicitudes no se gestionan de forma ordenada, se generan retrasos, pérdida de información, duplicidad de trabajo y dificultades para dar seguimiento a los casos reportados.

Con el fin de atender esta necesidad, se plantea el desarrollo de un sistema de tickets que permita registrar solicitudes de soporte, darles seguimiento a través de distintos estados y documentar su resolución. Además de la gestión básica de incidencias, el proyecto incorporará un módulo orientado a la revisión de fragmentos de código, permitiendo registrar solicitudes asociadas a errores de programación, malas prácticas, observaciones técnicas o recomendaciones de mejora.

Este sistema busca ofrecer una solución organizada, clara y funcional, donde cada solicitud quede documentada, pueda ser revisada por un responsable y avance a través de un flujo de atención bien definido hasta su cierre. La propuesta combina conceptos de gestión de soporte técnico con elementos propios del desarrollo web y del análisis de código.

> **Propósito general del proyecto:** construir un sistema web que permita crear, administrar, seguir y resolver tickets de soporte técnico, incluyendo solicitudes relacionadas con revisión de fragmentos de código.

## 2. Descripción del proyecto

El proyecto consiste en desarrollar una aplicación web de gestión de tickets, donde los usuarios puedan registrar solicitudes de soporte y los responsables del sistema puedan revisarlas, actualizarlas y cerrarlas una vez resueltas. El sistema deberá contar con una base de datos para almacenar la información de cada ticket y con un sistema de estados que permita conocer en qué etapa se encuentra cada solicitud.

Dentro de las funcionalidades principales se contempla la creación de tickets, el seguimiento de cada caso y su resolución final. Como característica adicional, el sistema permitirá registrar tickets relacionados con fragmentos de código, de manera que se pueda solicitar revisión técnica sobre errores, estructura, lógica o posibles mejoras en un bloque de programación.

El sistema deberá presentar una interfaz clara, organizada y orientada a la productividad, permitiendo distinguir de forma rápida el tipo de ticket, su prioridad, su estado actual y la respuesta generada por el equipo de soporte o por el revisor correspondiente.

## 3. Objetivo general

Desarrollar un sistema web de gestión de solicitudes de soporte que permita crear tickets, dar seguimiento a su progreso, controlar su estado y registrar su resolución, incluyendo además la posibilidad de revisar fragmentos de código como parte del proceso de soporte técnico.

## 4. Objetivos específicos

- Diseñar una interfaz web clara y funcional para la creación y administración de tickets.
- Permitir el registro de solicitudes de soporte mediante formularios estructurados.
- Implementar un sistema de estados que refleje el avance de cada ticket.
- Almacenar la información de los tickets en una base de datos.
- Facilitar el seguimiento de las solicitudes por parte del usuario y del equipo de soporte.
- Incorporar un módulo para revisión de fragmentos de código dentro del sistema de tickets.
- Registrar respuestas, observaciones y solución final de cada caso atendido.

## 5. Datos generales del trabajo

| Campo | Detalle |
|---|---|
| Título del proyecto | Sistema de Tickets para Soporte Técnico y Revisión de Fragmentos de Código |
| Docente | Javier Ochoa |
| Materia | Programación Web II |
| Tipo de proyecto | Desarrollo de aplicación web |
| Enfoque principal | Gestión de solicitudes, seguimiento y resolución |
| Área complementaria | Revisión técnica de fragmentos de código |
| Resultado esperado | Sistema funcional de soporte técnico |

## 6. Planteamiento de la necesidad

En muchos contextos de soporte técnico, las solicitudes se gestionan de manera informal mediante mensajes sueltos, correos o conversaciones no estructuradas. Esto genera desorganización, falta de trazabilidad y dificultad para conocer qué problemas fueron reportados, cuáles están pendientes y cuáles ya fueron resueltos.

Del mismo modo, en escenarios de programación y desarrollo web, frecuentemente se requiere revisar fragmentos de código para detectar errores lógicos, problemas de sintaxis, malas prácticas o mejoras posibles. Cuando estas revisiones no quedan organizadas dentro de un sistema, resulta difícil mantener control sobre el proceso y documentar las soluciones aplicadas.

Frente a esta situación, el sistema de tickets propuesto permitirá centralizar todas las solicitudes en una sola plataforma, asignar estados a cada caso, almacenar la información relevante y facilitar el seguimiento hasta la resolución final.

## 7. Alcance del sistema

El alcance del sistema define con claridad qué funciones formarán parte de la solución y cuáles aspectos quedan fuera del proyecto.

### 7.1. Lo que sí hará el sistema

- Permitirá crear tickets de soporte técnico.
- Permitirá registrar solicitudes relacionadas con revisión de código.
- Guardará la información de cada ticket en una base de datos.
- Mostrará el estado actual de cada solicitud.
- Permitirá actualizar el avance del ticket.
- Registrará observaciones, respuestas y resoluciones.
- Organizará el historial de tickets generados.

### 7.2. Lo que no hará el sistema

- No ejecutará automáticamente el código ingresado por el usuario.
- No reemplazará completamente el criterio técnico humano en la revisión de código.
- No resolverá automáticamente todos los problemas reportados.
- No estará orientado a soporte telefónico o presencial directo.
- No funcionará como plataforma de chat en tiempo real.

> **Delimitación importante:** el sistema organizará y gestionará solicitudes, pero la calidad de la resolución dependerá del análisis técnico realizado por el responsable del ticket o por el revisor correspondiente.

## 8. Funcionalidades principales

El proyecto contempla dos grandes líneas funcionales: la gestión de tickets de soporte y la revisión de fragmentos de código. Ambas deben estar integradas de manera coherente dentro de una misma plataforma.

### 8.1. Creación de tickets

El usuario deberá poder registrar una nueva solicitud indicando título, descripción del problema, categoría, prioridad y, en caso de ser necesario, fragmentos de código relacionados con el incidente o consulta.

### 8.2. Seguimiento

Cada ticket tendrá un número o identificador y un estado asociado. Esto permitirá consultar en qué etapa se encuentra la solicitud y qué acciones se han realizado sobre ella.

### 8.3. Resolución

Una vez analizado el problema, el responsable podrá registrar la solución implementada, observaciones finales y cambiar el estado del ticket a resuelto o cerrado.

### 8.4. Revisión de fragmentos de código

El sistema también permitirá abrir tickets donde el contenido principal sea un bloque de código que deba ser revisado. En estos casos, el revisor podrá analizar el fragmento, registrar observaciones técnicas y documentar recomendaciones o correcciones sugeridas.

## 9. Requerimientos del sistema

### 9.1. Requerimientos funcionales

| ID | Descripción |
|---|---|
| RF-01 | El sistema deberá permitir crear tickets de soporte técnico. |
| RF-02 | El sistema deberá almacenar cada ticket en una base de datos. |
| RF-03 | El sistema deberá manejar un sistema de estados para cada solicitud. |
| RF-04 | El sistema deberá permitir consultar el historial de tickets registrados. |
| RF-05 | El sistema deberá permitir actualizar la información de un ticket durante su atención. |
| RF-06 | El sistema deberá registrar la resolución final del caso. |
| RF-07 | El sistema deberá admitir tickets relacionados con revisión de fragmentos de código. |
| RF-08 | El sistema deberá mostrar observaciones técnicas asociadas a cada ticket. |

### 9.2. Requerimientos no funcionales

| ID | Descripción |
|---|---|
| RNF-01 | La interfaz debe ser clara, ordenada y fácil de usar. |
| RNF-02 | La información debe mostrarse de forma comprensible y organizada. |
| RNF-03 | El sistema debe facilitar el seguimiento visual del estado de cada ticket. |
| RNF-04 | La navegación debe ser simple e intuitiva. |
| RNF-05 | Los datos deben almacenarse de forma consistente en la base de datos. |
| RNF-06 | El sistema debe estar preparado para crecer en cantidad de solicitudes. |

## 10. Tecnologías a utilizar

El sistema será desarrollado como una aplicación web, por lo que se apoyará en tecnologías de frontend, backend y almacenamiento persistente.

| Componente | Tecnología sugerida | Función dentro del proyecto |
|---|---|---|
| Frontend | HTML5, CSS y JavaScript | Construcción visual del sistema, formularios, tablas, filtros y navegación. |
| Backend | Entorno servidor para aplicación web | Procesamiento de solicitudes, control de estados y comunicación con la base de datos. |
| Base de datos | Motor de almacenamiento persistente | Registro de tickets, estados, observaciones y resoluciones. |
| Módulo de revisión | Lógica de análisis y observación de código | Gestión de tickets asociados a fragmentos de programación. |
| Herramientas complementarias | Editor, pruebas y control de versiones | Organización del proyecto y validación del funcionamiento. |

## 11. Estructura general del sistema

Para facilitar el uso del sistema, la aplicación estará organizada en varias páginas o módulos principales, cada uno orientado a una función concreta.

### 11.1. Página de inicio

Mostrará una breve explicación del sistema, su objetivo y accesos principales a las diferentes secciones.

### 11.2. Módulo de creación de tickets

Permitirá registrar una nueva solicitud mediante un formulario estructurado donde se definirá el problema reportado.

### 11.3. Módulo de seguimiento

Permitirá consultar los tickets creados, visualizar su estado actual, fecha de creación, prioridad y observaciones registradas.

### 11.4. Módulo de resolución

Permitirá cerrar solicitudes una vez analizadas y documentadas.

### 11.5. Módulo de revisión de código

Permitirá ingresar un fragmento de código como parte de una solicitud técnica, con espacio para comentarios, análisis y recomendaciones.

## 12. Sistema de estados

Uno de los elementos más importantes del proyecto es el sistema de estados, ya que permitirá conocer el avance de cada ticket. Los estados deben ser claros, ordenados y útiles para el seguimiento del proceso.

| Estado | Significado |
|---|---|
| Abierto | El ticket ha sido creado y está pendiente de revisión inicial. |
| En revisión | La solicitud está siendo analizada por el equipo de soporte o por el revisor de código. |
| En proceso | Se están realizando acciones para resolver el problema reportado. |
| Resuelto | El caso ha sido atendido y cuenta con una solución registrada. |
| Cerrado | El ticket finalizó su ciclo de atención y queda archivado como concluido. |

> **Importancia del sistema de estados:** este mecanismo permite ordenar el flujo de trabajo, saber qué casos están pendientes y mantener control sobre el progreso de cada solicitud registrada.

## 13. Contenido del ticket

Cada ticket deberá almacenar información suficiente para permitir su análisis, seguimiento y resolución. Los campos deberán estar bien definidos para que el sistema sea útil y consistente.

| Campo del ticket | Descripción |
|---|---|
| Identificador del ticket | Código único que permite diferenciar cada solicitud. |
| Título | Resumen breve del problema o requerimiento. |
| Descripción | Explicación detallada de la solicitud de soporte. |
| Categoría | Tipo de incidente o tema reportado. |
| Prioridad | Nivel de urgencia del ticket. |
| Estado | Etapa actual del proceso de atención. |
| Fecha de creación | Registro temporal de cuándo fue generado. |
| Observaciones | Comentarios añadidos durante la revisión. |
| Resolución | Respuesta final o solución aplicada al caso. |
| Fragmento de código | Campo opcional para tickets relacionados con programación. |

## 14. Módulo de revisión de fragmentos de código

Además del soporte general, el sistema tendrá la capacidad de recibir tickets orientados a la revisión de fragmentos de código. Esta funcionalidad es importante en contextos académicos y de desarrollo, donde muchas solicitudes surgen por errores en lógica, estructura o sintaxis de un programa.

En este tipo de ticket, el usuario podrá adjuntar o escribir un bloque de código y explicar cuál es el problema observado. Posteriormente, el responsable del caso podrá registrar observaciones, posibles causas del error y recomendaciones de mejora.

### 14.1. Aspectos que pueden revisarse

- Errores de estructura lógica.
- Problemas de sintaxis.
- Uso inadecuado de variables.
- Validaciones incompletas.
- Organización deficiente del código.
- Falta de buenas prácticas de programación.

> **Finalidad del módulo de código:** convertir el sistema de tickets en una herramienta más útil para el entorno de soporte técnico y desarrollo, permitiendo que una solicitud no solo describa un problema, sino que también documente un fragmento concreto del programa que debe ser revisado.

## 15. Planificación del trabajo

La planificación del proyecto debe organizarse en fases para garantizar un desarrollo coherente y ordenado. Cada fase responde a una necesidad concreta dentro de la construcción del sistema.

### 15.1. Fase de análisis

En esta etapa se identificará el problema a resolver, el perfil del usuario, las necesidades del sistema y las funciones mínimas requeridas para que el proyecto sea útil.

### 15.2. Fase de diseño

Aquí se definirá la estructura visual de la aplicación, el diseño de formularios, la disposición de tablas, los módulos principales y el flujo general de navegación.

### 15.3. Fase de desarrollo

Se construirá la interfaz web, se implementará la lógica del sistema y se conectará la aplicación con la base de datos para registrar y consultar tickets.

### 15.4. Fase de pruebas

Se verificará el correcto funcionamiento del sistema, la creación de tickets, el cambio de estados, la carga de observaciones y la consulta del historial.

### 15.5. Fase de documentación

Finalmente, se documentará el proyecto explicando su objetivo, componentes, estructura, funcionamiento y resultados obtenidos.

## 16. Flujo de funcionamiento del sistema

El funcionamiento general del sistema puede representarse mediante una secuencia de acciones ordenadas que muestran cómo una solicitud pasa desde su creación hasta su cierre final.

1. El usuario ingresa al sistema.
2. El usuario accede al formulario de creación de ticket.
3. El usuario registra la información del problema o solicitud.
4. En caso necesario, añade un fragmento de código para revisión.
5. El sistema guarda el ticket en la base de datos con estado inicial.
6. El responsable revisa la solicitud.
7. El ticket cambia de estado conforme avanza su atención.
8. Se registran observaciones y posibles acciones realizadas.
9. Se documenta la resolución del caso.
10. El ticket se marca como resuelto o cerrado.

> **Resultado esperado del flujo:** toda solicitud debe quedar registrada, seguida y resuelta dentro de un proceso ordenado, visible y fácil de consultar tanto para el usuario como para el responsable técnico.

## 17. Explicación paso a paso del trabajo a realizar

### 17.1. Paso 1: comprender la finalidad del sistema

Lo primero es definir que el sistema estará enfocado en organizar solicitudes de soporte técnico. Esto implica registrar, clasificar y controlar cada ticket.

### 17.2. Paso 2: definir las funciones principales

Después se deben establecer claramente las funciones básicas del proyecto: creación de tickets, seguimiento de estados, resolución de casos y revisión de código.

### 17.3. Paso 3: estructurar la información del ticket

Luego se define qué datos se deben capturar en cada solicitud para que el sistema tenga utilidad real y permita una atención adecuada.

### 17.4. Paso 4: diseñar el flujo de estados

Se debe establecer el recorrido lógico que seguirá una solicitud desde que se crea hasta que se cierra.

### 17.5. Paso 5: organizar las páginas del sistema

Se deben distribuir las funcionalidades en módulos o vistas, garantizando una navegación clara y comprensible.

### 17.6. Paso 6: preparar la base de datos

Es necesario definir qué información quedará almacenada de forma persistente para permitir consultas posteriores y control del historial.

### 17.7. Paso 7: incorporar el módulo de revisión de código

Aquí se añade la funcionalidad especial para que ciertos tickets puedan incluir fragmentos de código como parte del soporte solicitado.

### 17.8. Paso 8: estructurar las observaciones y resoluciones

Se debe permitir que el responsable registre comentarios técnicos y la solución final de cada caso.

### 17.9. Paso 9: revisar la experiencia de uso

Antes de dar por terminado el sistema, se debe verificar que el proceso de creación, seguimiento y consulta de tickets sea sencillo y ordenado.

### 17.10. Paso 10: documentar la propuesta final

Finalmente, se debe presentar el sistema en un documento bien organizado, explicando su lógica, sus módulos y sus resultados esperados.

## 18. Cuadro resumen del proyecto

| Componente | Función principal | Resultado esperado |
|---|---|---|
| Formulario de tickets | Registrar solicitudes de soporte | Entrada clara y organizada de casos |
| Sistema de estados | Controlar el avance del ticket | Seguimiento visible del proceso |
| Base de datos | Almacenar la información del sistema | Persistencia de tickets y consultas |
| Módulo de seguimiento | Consultar el historial de solicitudes | Trazabilidad de cada caso |
| Módulo de resolución | Documentar la solución final | Cierre formal y ordenado del ticket |
| Revisión de código | Analizar fragmentos de programación | Soporte técnico más completo |

## 19. Entregables

Los entregables del proyecto deben reflejar tanto el funcionamiento técnico del sistema como su correcta documentación.

- Sistema web funcional de soporte técnico basado en tickets.
- Módulo de creación y seguimiento de solicitudes.
- Base de datos con almacenamiento de tickets y estados.
- Módulo de resolución y cierre de casos.
- Funcionalidad para revisión de fragmentos de código.
- Documento explicativo del proyecto en formato académico.

## 20. Resultados esperados

Al finalizar el proyecto se espera contar con una aplicación web funcional y bien estructurada, capaz de gestionar solicitudes de soporte de manera ordenada. El sistema deberá registrar tickets, permitir el seguimiento mediante estados, almacenar toda la información relevante y facilitar la resolución documentada de cada caso.

También se espera que el módulo de revisión de fragmentos de código aporte valor adicional al sistema, permitiendo atender consultas técnicas relacionadas con programación dentro del mismo flujo de soporte.

> **Meta final del proyecto:** entregar un sistema de soporte técnico funcional, organizado y útil, capaz de gestionar solicitudes, documentar su avance y atender casos relacionados con revisión de código dentro de una sola plataforma web.

## 21. Conclusiones

El desarrollo de un sistema de tickets representa una solución práctica para organizar solicitudes de soporte técnico de forma estructurada. Mediante esta propuesta es posible centralizar incidencias, registrar su estado, documentar el trabajo realizado y ofrecer una respuesta clara a cada caso.

La inclusión de un módulo orientado a revisión de fragmentos de código amplía el alcance del proyecto y lo hace especialmente pertinente dentro del área de Programación Web II, ya que conecta la gestión de soporte con el análisis de problemas propios del desarrollo de software. De esta manera, el proyecto no solo resuelve una necesidad organizativa, sino que también fortalece el componente técnico y académico de la aplicación.

En términos generales, la propuesta constituye un trabajo completo, útil y coherente, que integra estructura web, gestión de información, control de procesos y documentación clara, ofreciendo una base sólida para la presentación y desarrollo del proyecto.

## 22. Anexo: resumen ejecutivo

> **Resumen ejecutivo**
>
> El presente proyecto propone el desarrollo de un sistema web de tickets orientado a la gestión de solicitudes de soporte técnico. La solución permitirá crear tickets, dar seguimiento a su progreso, administrar estados y registrar la resolución final de cada caso. Adicionalmente, incluirá la posibilidad de revisar fragmentos de código como parte de las solicitudes, ampliando así su utilidad en contextos de programación y desarrollo. El sistema se concibe como una plataforma organizada, clara y funcional, adecuada para centralizar incidencias y mejorar el control del proceso de soporte.
