Vue.component('DrawEditor', {
    props: [
        'imgbg', //imagen de fondo
    ],
    data () {
        return {
            canvas: null,
            ctx: null,
            canvas: null,
            ctx: null,
            colors: ['#5EB246', '#005093', '#EB8B2E', '#DB3E34', '#444', '#fff'],
            currentcolor: '#5EB246',
            sizes: [10, 6, 2],
            currentBrushSize: 6,
            scope: null,
            realSize: {width:0, height: 0},
            currentSize: {width:0, height: 0},
        }
    },
    template: `
        <div class="draw-editor">
            <canvas class="drawEditorCanvas " ref="canvas" id="drawEditorCanvas" @mousedown="mouseDown" @touchstart="mouseDown"></canvas>
            <div class="botonera" :style="'background-color:'+currentcolor+';'">
                <div class="colors">
                    <div v-for="col in colors" class="color" :style="'background-color:'+col+';'" @click="setColor($event, col)"></div>
                </div>
                <div class="sizes">
                    <div v-for="sz in sizes" :style="'background-color:'+currentcolor+';'" :class="'size size_'+sz + ' ' + (sz==currentBrushSize ? 'on':'off')" @click="setSize($event, sz)"></div>
                </div>
                <button class="button" @click="cleanCanvas(this)">Limpiar</button>
                <button class="button" @click="downloadCanvas(this)">Descargar</button>
            </div>
        </div>
    `,
    computed: {
        
    },
    methods: {
        setColor(e, col){
            s_select.play()
            this.currentcolor = col
            app.particleAnimation(e, null, null, 60, col)
        },
        setSize(e, sz){
            s_select.play()
            this.currentBrushSize = sz
            app.particleAnimation(e, null, null, 60)
        },
        initCanvas () {
            this.canvas = this.$refs.canvas
            //this.canvas = this.$refs.canvas
            var parentEl = document.getElementsByClassName('draw-editor')[0]
            parentEl.appendChild(this.canvas)
            //parentEl.appendChild(this.canvas)
            var _this = this
            setTimeout(function () {
                _this.updateCanvas()
                _this.ctx = _this.canvas.getContext('2d')
                //_this.ctx = _this.canvas.getContext('2d')
                
                var background = new Image()
                background.src = _this.imgbg
                background.onload = function () {
                    _this.ctx.drawImage(background, 0, 0)
                    document.getElementsByClassName('draw-editor')[0].classList.add('imgloaded')
                    _this.realSize = {width: background.width, height: background.height }
                }
                _this.paperStart(background)
            }, 500)
        },
        updateCanvas () {
            var parentEl = document.getElementsByClassName('draw-editor')[0]

            this.canvas.width = parentEl.clientWidth
            this.canvas.height = parentEl.clientHeight
            this.canvas.style.width = parentEl.clientWidth + 'px'
            this.canvas.style.height = parentEl.clientHeight + 'px'
            this.canvas.getContext('2d').scale(1, 1)
            
            /*
            this.canvas.width = parentEl.clientWidth
            this.canvas.height = parentEl.clientHeight
            this.canvas.style.width = parentEl.clientWidth + 'px'
            this.canvas.style.height = parentEl.clientHeight + 'px'
            this.canvas.getContext('2d').scale(1, 1)
            */
        },
        downloadCanvas () {
            var file = this.canvas.toDataURL("image/png")
            this.canvas.toBlob(function(blob) {
                saveAs(blob, "imagen.png")
            })
            s_win.play()
        },
        cleanCanvas(){
            s_error.play()
            this.scope.project.activeLayer.removeChildren()
        },
        pathCreate(scope) {
            scope.activate()
            return new paper.Path({
                strokeColor: this.currentcolor,
                strokeJoin: 'round',
                strokeWidth: this.currentBrushSize
            })
        },
        createTool(scope) {
            scope.activate()
            return new paper.Tool()
        },
        getRealPos (event) {
            const drawEObj = document.getElementsByClassName('draw-editor')[0]
            this.currentSize = {width: drawEObj.clientWidth, height: drawEObj.clientHeight, }
            let rw = ((this.realSize.width)/100) * ((event.event.layerX*100)/this.currentSize.width)
            let rh = ((this.realSize.height)/100) * ((event.event.layerY*100)/this.currentSize.height)
            var realPos= { x: rw, y: rh }
            return realPos
        },
        mouseDown() {
            // in order to access functions in nested tool
            let self = this

            // create drawing tool
            this.tool = this.createTool(this.scope)
            this.tool.onMouseDown = (event) => {
                var realPos = self.getRealPos(event)

                var hitResult = this.scope.project.hitTest(realPos, {
                    segments: true,
                    stroke: true,
                    fill: true,
                    tolerance: 5
                })
                if(hitResult && self.currentcolor=='#fff'){ if(hitResult.type=="stroke"){ hitResult.item.remove() } }

                if(self.currentcolor!='#fff'){
                    // init path
                    self.path = self.pathCreate(self.scope)
                    // add point to path
                    self.path.add(realPos)
                }
            }
            this.tool.onMouseDrag = (event) => {
                var realPos = self.getRealPos(event)
                
                
                var hitResult = this.scope.project.hitTest(realPos, {
                    segments: true,
                    stroke: true,
                    fill: true,
                    tolerance: 5
                })
                if(hitResult && self.currentcolor=='#fff'){ if(hitResult.type=="stroke"){ hitResult.item.remove() } }
                if(self.currentcolor!='#fff'){
                    self.path.add(realPos)
                }
                //app.particleAnimation(event.event, 1, 2000, 10, self.currentcolor)

            }
            this.tool.onMouseUp = (event) => {
                var realPos = self.getRealPos(event)

                // line completed
                if(self.currentcolor!='#fff'){
                    self.path.simplify(10)
                    self.path.add(realPos)
                }
            }
        },
        paperStart(bgimg){
            /* paperjs */
            this.scope = new paper.PaperScope()
            this.scope.setup(this.canvas)
            var rasterbg = new paper.Raster(bgimg)
            rasterbg.position = this.scope.view.center
            new paper.Layer()
        }
    },
    mounted () {
        this.initCanvas()
    }
})

/*
    <draw-editor :imgbg="url"></draw-editor>
*/




