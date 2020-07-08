Vue.component('drag', {
    props: [
        'x', 'y',
        'dropzone',
        'dropsound',
        'dropsound-attr',
        'data',
        'returnToPosition',
        'stayInDrop'
    ],
    data() {
        return {
            posx: 0,
            posy: 0,
            draggable: null
        }
    },
    template: `
        <div class="drag" ref="drag" :style="'left:'+x+'%; top:'+y+'%;'">
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
            _this.particleAnimation(e)
            _this.setClassAnimation('start')
            s_select.play()
        },
        Drag (e) {
            var _this = this
            _this.HitTestFn(e, false)
        },
        DragEnd (e) {
            var _this = this
            _this.particleAnimation(e)
            _this.HitTestFn(e, true)
        },
        particleAnimation(e, num, time, size, onecolor) {
            if(e) {
                render.play();
                updateCoords(e);
                animateParticules(pointerX, pointerY, num, time, size, onecolor);
            }
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
                    theclass = 'animate__bounce'
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
                        _this.dropHitTest(dropzone)

                    } else {
                        _this.hoverHitTest(dropzone)
                    }
                } else {
                    if(!isdrop) { _this.hoverExitHitTest(dropzone) }
                }
            }
            if(isdrop && drops == 0){ _this.returnToInitPos() }
        },
        hoverHitTest(dropzone) {
            if(!dropzone.classList.contains('hover')){
                dropzone.classList.add('hover')
                s_select.play()
            }
        },
        hoverExitHitTest(dropzone) { dropzone.classList.remove('hover') },
        dropHitTest(dropzone) {
            var _this = this
            if(this.data == dropzone.getAttribute('data')){
                //ok
                s_ok.play()
                _this.$emit('isok')
                if(_this.returnToPosition!=undefined) { _this.returnToInitPos() }
                if(_this.stayInDrop!=undefined) {
                    _this.draggable[0].disable()
                } else {
                    _this.returnToInitPos()
                }
            } else {
                //error
                s_error.play()
                _this.$emit('iserror')
                if(_this.stayInDrop!=undefined) {
                    _this.draggable[0].disable()
                } else {
                    _this.returnToInitPos()
                }
            }
        },
        returnToInitPos(){
            var _this = this
            TweenLite.to(_this.$refs.drag, .5, {x:0, y:0, top: _this.posy, left: _this.posx, delay: .2});
        }
    },
    mounted () {
        this.init()
    }
})
