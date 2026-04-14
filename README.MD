# Proyecto Integrador Anual - Actividad 5 (2026)
EEST N1 "Eduardo Ader" - 7mo 2da

## Descripcion
Aplicacion web frontend para registrar bicicletas con interfaz moderna (glassmorphism) y gestion local de datos.

## Funcionalidades implementadas
- Formulario de alta con campos de usuario y bicicleta.
- Vista previa de imagen antes de guardar.
- Validaciones de formulario con mensajes usando Toastify JS.
- Guardado de registros en LocalStorage.
- Imagen almacenada en base64 dentro de cada registro.
- Listado dinamico de registros cargados desde LocalStorage.
- Edicion de registros mediante modal.
- Eliminacion de registros mediante modal de confirmacion.

## Stack tecnologico
- HTML5
- CSS3
- JavaScript vanilla
- Toastify JS (CDN)

## Estructura del proyecto
```text
Actividad-5/
|-- index.html
|-- README.MD
|-- LICENSE.MD
|-- css/
|   |-- style.css
|-- js/
|   |-- validacion.js
|   |-- carga.js
|   |-- modals.js
```

## Responsabilidad por archivo
- js/validacion.js:
	- Validaciones del formulario.
	- Toasts con Toastify.
	- Utilidades para LocalStorage.
	- Conversion de imagen a base64.
	- Alta de nuevos registros.
- js/carga.js:
	- Render del listado.
	- Logica de editar y borrar.
	- Integracion con modales.
- js/modals.js:
	- Apertura y cierre de modales.

## Como ejecutar
1. Abrir la carpeta Actividad-5 en VS Code.
2. Abrir index.html en navegador (doble click o con Live Server).
3. Registrar bicicletas y verificar en la lista de la derecha.

## Notas tecnicas
- No usa backend ni base de datos externa.
- Toda la persistencia se maneja en LocalStorage del navegador.
- Si se limpia el almacenamiento del navegador, se eliminan los registros.

## Licencia
Proyecto academico para uso educativo.