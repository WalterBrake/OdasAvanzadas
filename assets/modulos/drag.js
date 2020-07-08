Vue.component('drag', {
    props: [
        'dropzone', // item sobre el que se hace drop
        'dragsound', // sonido al iniciar drag
        'dropsound', // sonido al ser soltado
        'dropsound-attr', // sonido en drop obtenido desde el dropzone
        'data', // valor a comparar
        'returnIfError', //regresa si error
        'returnToPosition', // regresa aunque haya drop
        'stayInDrop', // se queda al hacer drop
        'stayIfOk', // se queda (deshabilita) si en drop es ok
        'dropzoneOkClass', // coloca clase al dropzone si es ok
        'dropzoneErrorClass', // coloca clase al dropzone si es error
        'dragOkClass', // coloca clase al drag si es ok
        'dragErrorClass', // coloca clase al drag si es error
        'particleColor', // color de particulas
        'initclass', // class de inicio
    ],
    data() {
        return {
            posx: 0,
            posy: 0,
            draggable: null
        }
    },
    //:style="'left:'+x+'%; top:'+y+'%;'"
    template: `
        <div ref="drag" :class="'drag ' + (initclass!=undefined?initclass:'')">
            <slot></slot>
        </div>
    `,

    methods: {
        init () {
            var _this = this
            _this.posx = _this.$refs.drag.offsetLeft
            _this.posy = _this.$refs.drag.offsetTop
            _this.$refs.drag.children[0].classList.add('animate__animated')
            _this.draggable = Draggable.create(_this.$refs.drag, {
                type: 'x,y',
                bounds: '.activity',
                onDragStart: function(e) { _this.DragStart(e) },
                onDrag: function(e) { _this.Drag(e) },
                onDragEnd: function(e) { _this.DragEnd(e) }
            })
        },
        DragStart (e) {
            var _this = this
            app.particleAnimation(e, null, null, null, _this.particleColor)
            _this.setClassAnimation('start')
            s_select.play()
        },
        Drag (e) {
            var _this = this
            _this.HitTestFn(e, false)
        },
        DragEnd (e) {
            var _this = this
            app.particleAnimation(e, null, null, null, _this.particleColor)
            _this.HitTestFn(e, true)
        },
        setClassAnimation(name) {
            var _this = this
            var theclass
            switch(name) {
                case 'start':
                    theclass = 'animate__rubberBand'
                    break
                case 'error':
                    theclass = 'animate__wobble'
                    break
                case 'ok':
                    theclass = 'animate__flash'
                    break
            }
            _this.$refs.drag.children[0].classList.add(theclass)
            setTimeout(function () {
                _this.$refs.drag.children[0].classList.remove(theclass)
            }, 1000)
        },
        HitTestFn (e, isdrop) {
            var _this = this
            var dropzones = document.querySelectorAll(_this.dropzone)
            var drops = 0
            for(var dr = 0; dr < dropzones.length; dr++) {
                var dropzone = dropzones[dr]
                if(Draggable.hitTest(_this.$refs.drag, dropzone, '50%')){
                    if(isdrop){
                        drops++
                        _this.dropHitTest(dropzone, e)

                    } else {
                        _this.hoverHitTest(dropzone, e)
                    }
                } else {
                    if(!isdrop) { _this.hoverExitHitTest(dropzone, e) }
                }
            }
            if(isdrop && drops == 0){ _this.backToInitPos() }
        },
        hoverHitTest(dropzone, e) {
            var _this = this
            if(!this.dropzoneCanBeDropped(dropzone)){
                return false
            }
            if(!dropzone.classList.contains('hover')){
                dropzone.classList.add('hover')
                s_select.play()
            }
        },
        hoverExitHitTest(dropzone, e) {
            if(dropzone.classList.contains('hover')){ dropzone.classList.remove('hover') }
        },
        dropHitTest(dropzone, e) {
            if(dropzone.classList.contains('hover')){ dropzone.classList.remove('hover') }
            var _this = this
            
            if(!_this.dropzoneCanBeDropped(dropzone)){
                _this.backToInitPos()
                return false
            } else {
                dropzone.classList.add('dropzoneused')
            }
            if(this.data == dropzone.getAttribute('data')){
                //## OK
                s_ok.play()
                _this.$emit('isok')
                _this.returnToPositionFn()
                _this.stayInDropFn()
                _this.dropzoneStatusClass('ok', dropzone)
                _this.dropzoneSound(dropzone, 'oksound')
                _this.dragStatusClass('ok')
                _this.stayIfOkFn()
                app.particleAnimation(e, 100, null, null)
                EventBus.$emit('isok')
                _this.setClassAnimation('ok')
            } else {
                //## ERROR
                s_error.play()
                _this.$emit('iserror')
                _this.stayInDropFn()
                _this.dropzoneStatusClass('error', dropzone)
                _this.dropzoneSound(dropzone, 'errorsound')
                _this.returnToPositionFn()
                _this.returnIfErrorFn()
                _this.dragStatusClass('error')
                EventBus.$emit('iserror')
                _this.setClassAnimation('error')
            }
        },
        dropzoneCanBeDropped (dropzone) {
            if(dropzone.getAttribute('droptimes') == 'multiple') {
                return true
            } else if(dropzone.getAttribute('droptimes') == 'once') {
                return dropzone.classList.contains('dropzoneused') ? false : true
            } else if(dropzone.getAttribute('droptimes') == 'untilok') {
                return dropzone.classList.contains(this.dropzoneOkClass) ? false : true
            }
        },
        dropzoneStatusClass(status, dropzone){
            var _this = this
            if(status == 'ok' && _this.dropzoneOkClass!=undefined) {
                dropzone.classList.add(_this.dropzoneOkClass)
                if(dropzone.classList.contains(_this.dropzoneErrorClass)){ dropzone.classList.remove(_this.dropzoneErrorClass) }
            }
            if(status == 'error' && _this.dropzoneErrorClass!=undefined) {
                dropzone.classList.add(_this.dropzoneErrorClass)
                if(dropzone.classList.contains(_this.dropzoneOkClass)){ dropzone.classList.remove(_this.dropzoneOkClass) }

            }
        },
        dragStatusClass(status){
            var _this = this
            if(status == 'ok' && _this.dragOkClass!=undefined) {
                _this.$refs.drag.classList.add(_this.dragOkClass)
                if(_this.$refs.drag.classList.contains(_this.dragErrorClass)){ _this.$refs.drag.classList.remove(_this.dragErrorClass) }
            }
            if(status == 'error' && _this.dragErrorClass!=undefined) {
                _this.$refs.drag.classList.add(_this.dragErrorClass)
                if(_this.$refs.drag.classList.contains(_this.dragOkClass)){ _this.$refs.drag.classList.remove(_this.dragOkClass) }

            }
        },
        stayIfOkFn(){
            if(this.stayIfOk!=undefined) {
                this.draggable[0].disable()
            }
        },
        stayInDropFn(){
            var _this = this
            if(_this.stayInDrop!=undefined) {
                _this.draggable[0].disable()
            } else {
                _this.returnToPositionFn()
            }
        },
        returnToPositionFn(){
            if(this.returnToPosition!=undefined) {
                this.backToInitPos()
            }
        },
        returnIfErrorFn(){
            if(this.returnIfErrorFn!=undefined) {
                this.backToInitPos()
            }
        },
        backToInitPos(){
            TweenLite.to(this.$refs.drag, .5, {x:0, y:0, top: this.posy, left: this.posx, delay: .6});
        },
        dropzoneSound(dropzone, attr) {
            if(dropzone.getAttribute(attr)){
                var sound = new Howl({ src: [dropzone.getAttribute(attr)] })
                sound.play()
                
            }
        }
    },
    mounted () {
        this.init()
    }
})
