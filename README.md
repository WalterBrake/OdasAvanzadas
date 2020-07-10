# OdasAvanzadas

- [Clonar repositorio de Github](#clonar-repositorio-de-github)
- [Servidor Local](#servidor-local)
- [Estructura HTML](#estructura-html)
- [Configuración de componentes](#configuracion-de-componentes)
    - [Scene](#scene)
    - [Info](#info)
    - [Activity](#activity)
- [Componentes de actividad](#componentes-de-actividad)
    - [Drag](#drag)
    - [Clickable](#clickable)
    - [Audiotext](#audiotext)
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


## Servidor Local

Para poder correr los htmls debe hacerse desde un servidor (local o remoto). En mac viene integrado un servidor php que se puede correr desde la terminal.

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


##  Estructura HTML
```
- <html>
  - <head>
    - <title> - Cambiar título.
    - <style> - Estilos opcionales.
  - <body>
    - <app> - Agrupa todo
        - <scene> - Divide las pantallas, Se usa en inicio, en cada actividad y el final.
        - <info> - La información de la actividad, titulo, instrucciones, puntaje y tipo de actividad.
        - <activity> - Contiene toda la actividad.
```


## Configuración de componentes

### scene
  
Cada pantalla es una escena. **Siempre** debe iniciar y terminar con escenas vacias. Cada una tiene un **v-if** y un **:key** que corresponde con la posición en que se encuentra. 

La escena de incio siempre es "0" y la final es el número consecutivo según el número de actividades, además de que se usa el atributo **start-scene** o **end-scene** para la escena inicial y la final:

```html
    <scene v-if="currentScene==0" :key="0" start-scene @completed="sceneCompleted"></scene>
    <scene v-if="currentScene==1" :key="1" @completed="sceneCompleted"></scene>
    <scene v-if="currentScene==2" :key="3" end-scene :final-data="finalData"></scene>
```

Si se tienen muchas actividades(pantallas) se vería así:

```html
    <scene v-if="currentScene==0" :key="0" start-scene @completed="sceneCompleted"></scene>
    <scene v-if="currentScene==1" :key="1" @completed="sceneCompleted"></scene>
    <scene v-if="currentScene==2" :key="2" @completed="sceneCompleted"></scene>
    <scene v-if="currentScene==3" :key="3" @completed="sceneCompleted"></scene>
    <scene v-if="currentScene==4" :key="4" end-scene :final-data="finalData"></scene>
```

Atributos | SCENE
--------- | ------
| **:ansers="3"** | Es el número de respuestas que hay en el interactivo.
| **:score="50"** | El puntaje que gana por actividad (* Ignorar).
| **:temporals="temporals"** | Detecta clicks y los guarda(* Ignorar)
| **:alloks-sound** | Ruta del audio que suena al terminar con todo OK.
| **alloks** | Si se coloca, todas las respuestas deben estar **OK** para avanzar.
| **scene-color="#ffdd00"** | Colocar de partículas con las que abre la escena.
| **@completed="sceneCompleted"** | Colocar en las escenas que tienen una escena siguiente (No se coloca en la escena final).
| **:devmode="true"** | Habilita un panel para hacer debug de las acciones.


### info

Atributos | INFO
--------- | ------
| **title="..."** | Título de la actividad
| **text="..."** | Instrucción
| **textaudio="..."** | Ruta del audio de la instrucción
| **type="dragdrop"** | Icono animado abajo a la derecha: "**dragdrop**", "**seleccionar**"
| **@completedinstructions="$refs.instructions2.play()"** | Se puede usar para llamar una función al término del audio de instrucción. (Ver ejemplo **/ES1T1/16/** que llama a una segunda instrucción.)

### activity

Sin configuración, sólo es importante que agrupe a la actividad.

## Componentes de actividad

### drag

Componente Drag & Drop.

Se coloca alrededor del objeto que se quiera arrastrar. (El objeto a arrastrar siempre debe ser una etiqueta, como img o div, no puede ser texto sólo).

```html
<drag initclass="arrastrable" dropzone=".caja" data="elemento">
    <div>Arrastrarme</div>
</drag>
```

Atributos | DRAG
--------- | ------
**initclass=""** | Clase que tendrá el objeto, en caso de tener que darle estilo. (Trae también la clase ".drag").
**dropzone=""** | Clase del objeto en que se depositará.
**data="cualquierTexto"** | El dropzone también lo tiene. Si se suelta en el dropzone y ambos tienen el mismo valor se toma como OK.
**dragsound=""** | Ruta del sonido al momento de iniciar el drag.
**dropsound=""** | Ruta del sonido al momento de soltar el objeto.
**dropzone-ok-class=""** | Clase que se añade al dropzone al soltar si es OK.
**dropzone-error-class=""** | Clase que se añade al dropzone al soltar si es ERROR.
**drag-ok-class=""** | Clase que se asigna al drag cuando se suelta y es OK. (* Requiere tener drag-error-class).
**drag-error-class=""** | Clase que se asigna al drag cuando se suelta y es ERROR. (* Requiere tener drag-ok-class).
**particle-color=""** | Color de las particulas que salen cuando es OK. De preferencia elegir el mismo color del objeto.

El **drag** depende de un objeto externo que se convierte en el DROPZONE y es a donde caerá. Puede ser de cualquier tipo pero debe usar la misma clase declarada en el atributo "dropzone" del componente drag. Su relación sobre si es correcto/incorrecto depende también del atributo "data". Si en ambos es el mismo, lo tomará como OK.

```html
<drag dropzone=".caja" data="elemento">
    <div>Arrastrarme</div>
</drag>
<div class="caja" data="elemento"></div>
```

El **dropzone** tiene  atributos que se ejecutan al momento de que el drag es soltado sobre él.

Atributos | DROPZONE
--------- | ------
**oksound=""** | Ruta del sonido al momento de recibir un drag y ser OK.
**errorsound=""** | Ruta del sonido al momento de recibir un drag y ser ERROR.
**data=""** | Debe corresponder con el drag que se podrá soltar. Si es igual es OK. Si no es ERROR.
**droptimes=""** | Veces que se pueden soltar drags hasta que el dropzone se deshabilite: "**multiple**" (infinito), "**once**" (una vez), "**untilok**" (cuando sea OK se deshabilita).


### clickable

Objetos que se les da click. Se coloca alrededor de cualquier elemento. (El objeto a arrastrar siempre debe ser una etiqueta, como img o div, no puede ser texto sólo).

Atributos | DROPZONE
--------- | ------
**isok="true"** | "True" OK es seleccionado. "False" OK es NO seleccionado.
`**v-model="temporals[0]"**` | Se enumera según el número de opciones que habrá.
**particle-color=""** | Color de las particulas que salen cuando es OK. De preferencia elegir el mismo color del objeto.



### audiotext