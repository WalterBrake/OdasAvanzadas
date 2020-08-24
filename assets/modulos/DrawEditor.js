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
            tools: ['brush', 'text'],
            currentTool: 'brush',
            colors: ['#5EB246', '#005093', '#EB8B2E', '#DB3E34', '#444', '#fff'],
            currentcolor: '#5EB246',
            sizes: [10, 6, 2],
            currentBrushSize: 6,
            scope: null,
            realSize: {width:0, height: 0},
            currentSize: {width:0, height: 0},
            inputTextOn: false,
            inputText: '',
            inputTextPoint: {x:0, y:0},
            inputTextPointScreen: {x:0, y:0},
            saved: false,
            firstAction: false,
        }
    },
    template: `
        <div class="draw-editor">
            <canvas class="drawEditorCanvas " ref="canvas" id="drawEditorCanvas" @mousedown="mouseDown" @touchstart="mouseDown"></canvas>
            
            <div class="inputText" v-if="inputTextOn && currentTool=='text' && currentcolor!='#fff'" :style="'border-color:'+currentcolor+'; left:'+inputTextPointScreen.x+'px; top:'+inputTextPointScreen.y+'px; margin-top:-'+(returnTextSize)+'px;'">
                <div :class="'row ' + rowdirection">
                    <input ref="inputTextInput" v-model="inputText" :style="'color:'+currentcolor+';' + ' font-size:'+returnTextSize+'px;' " />
                    <button :disabled="inputText.length<1" class="button" :style="'background-color:'+currentcolor+';'" @click="createText"><img src="aimg/ok.svg"></button>
                </div>
            </div>
            
            <div class="botonera" :style="'background-color:'+currentcolor+';'">
                <div class="tools">
                    <div v-for="to in tools" :style="'background-color:'+currentcolor+';'" :class="'tool tool_'+to + ' ' + (to==currentTool ? 'on':'off')" @click="setTool($event, to)"></div>
                </div>
                <div class="colors">
                    <div v-for="col in colors" class="color" :style="'background-color:'+col+';'" @click="setColor($event, col)"></div>
                </div>
                <div class="sizes row wrap">
                    <div v-for="sz in sizes" :style="'background-color:'+currentcolor+';'" :class="'size size_'+sz + ' ' + (sz==currentBrushSize ? 'on':'off')" @click="setSize($event, sz)"></div>
                </div>
                <div class="buttons row wrap">
                    <button class="button" @click="cleanCanvas(this)">Limpiar</button>
                    <button class="button finalizar" @click="downloadCanvas(this)" v-if="firstAction">Finalizar</button>
                </div>
            </div>
        </div>
    `,
    computed: {
        returnTextSize(){
            if(this.currentBrushSize==10){ return 28 }
            if(this.currentBrushSize==6){ return 20 }
            if(this.currentBrushSize==2){ return 15 }
        },
        rowdirection() {
            if(this.inputTextPointScreen.x > this.currentSize.width/2){
                return 'invert'
            } else {
                return 'normal'
            }
        },
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
        setTool(e, to){
            s_select.play()
            this.currentTool = to
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
                background.crossOrigin = 'anonymous'
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
            var file = this.canvas.toDataURL("image/jpeg", 0.8)

            /*
            this.canvas.toBlob(function(blob) {
                saveAs(blob, "imagen.png")
            })
            */
            let fwIt = 0
           let speedpart = 30
           var fw = setInterval(function () {
                fwIt++
                app.particleAnimation({clientX:window.innerWidth/(Math.random()*4), clientY:window.innerHeight/(Math.random()*4)}, 30, null, null)
                if(fwIt == speedpart) {
                    clearInterval(fw)
                }
            }, 100)
            var endData = JSON.stringify({screen: [file]})
            window.top.postMessage(endData, "*")

            this.saved = true
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
        createInputText(point, ev){
            this.inputTextOn = true
            this.inputTextPoint = point
            this.inputTextPointScreen = {x: ev.event.layerX, y: ev.event.layerY}
            var _this = this
            setTimeout(function(){_this.$refs.inputTextInput.focus()},100)
        },
        createText() {
            var txt = new paper.PointText(this.inputTextPoint)
            txt.fillColor = this.currentcolor
            txt.fontSize = this.returnTextSize
            txt.content = this.inputText
            this.inputTextOn = false
            this.inputText = ''
            if(!this.firstAction) { this.firstAction = true}
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
                    if(hitResult && self.currentcolor=='#fff'){ if(hitResult.type=="stroke" || hitResult.type == "fill"){ hitResult.item.remove() } }

                    if(self.currentcolor!='#fff' && self.currentTool=='brush'){
                        // init path
                        self.path = self.pathCreate(self.scope)
                        // add point to path
                        self.path.add(realPos)
                    } else if(self.currentcolor!='#fff' && self.currentTool == 'text'){
                        self.createInputText(realPos, event)
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
                if(self.currentcolor!='#fff' && self.currentTool=='brush' ){
                    self.path.add(realPos)
                }
                //app.particleAnimation(event.event, 1, 2000, 10, self.currentcolor)

            }
            this.tool.onMouseUp = (event) => {
                var realPos = self.getRealPos(event)

                // line completed
                if(self.currentcolor!='#fff' && self.currentTool=='brush'){
                    self.path.simplify(10)
                    self.path.add(realPos)
                    if(!this.firstAction) { this.firstAction = true}
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




