# OdasAvanzadas


## Clonar repositorio de Github

### Configuración

Instrucción | ---
------------ | -------------
Descargar Github | ![Github](readme/01.png)
Add > Clone Repository | ![Github](readme/02.png)
Buscar **OdasAvanzadas**, seleccionar y click en "CLONE" | ![Github](readme/03.png)
Abrir carpeta dando click derecho sobre el repositorio y "Reveal in Finder" | ![Github](readme/04.png)

### Publicar cambios

Para publicar cambios se realizan "Commit", que implica colocar un título (y descripción * opcional) para saber qué se realizó.

Instrucción | ---
------------ | ---------
Al comenzar a trabajar y antes de hacer cambios "mayores" realizar un **Fetch Origin** para verificar la sincronización. Si hay datos por actualizar aparecerá el botón **Pull from Origin**, que realizará la actualización. | ![Github](readme/05.png)
Cuando se modifican los archivos se habilita el **Commit**, donde se ingresa el summary y luego se da click al botón **Commit to gh-pages**| ![Github](readme/06.png)
Luego de hacer el commit se hace un **Push Origin** para publicar el cambio | ![Github](readme/07.png)


## Servidor Local (mac) para correr el proyecto


Navegar hacia el proyecto en la terminal
```shell
cd ruta/hacia/la/carpeta
```

![](readme/08.gif)


Correr un servidor local con el comando
```console
php -S localhost:8000
```

![](readme/09.png)


En el navegador se va **localhost:8000/materia/pagina** y deberá cargar el interactivo.


##  Estructura del HTML

- :arrow_forward: **<html>**
  - 	:arrow_forward:	:arrow_forward: **<head>**
      - 	:arrow_forward: :arrow_forward:	:arrow_forward: **<title>** - Cambiar título
      - 	:arrow_forward: :arrow_forward:	:arrow_forward: **<style>** - Estilos opcionales
  - 	:arrow_forward:	:arrow_forward: **<body>**



### Drag (& drop)
