Vue.component('inputable', {
    props: [
        'oksound', // sonido al reproducir cuando OK
        'particleColor', // color de particulas
        'initclass', // class de inicio (se pueden usar c1,c2,c3...)
        'isok', // texto a comparar
    ],
    data() {
        return {
            status: false,
            inputed: ''
        }
    },
    template: `
        <div ref="inputable" :class="'inputable ' + (initclass!=undefined?initclass:'')+ ' ' + (status ? 'okInput':'') ">
            <slot v-if="status"></slot>
            <input @input="filled" v-model="inputed" v-if="!status">
        </div>
    `,
    methods: {
        filled () {
            s_select.play()
            var textinput = this.inputed.toLowerCase()
            if(textinput == this.isok) {
                this.status = true
                this.isOkFn()
            }
        },
        isOkFn() {
            var _this = this
            setTimeout(function(){
                var vpOffset = _this.$refs.inputable.getBoundingClientRect()
                app.particleAnimation({clientX: vpOffset.left + (vpOffset.width/2), clientY: vpOffset.top + (vpOffset.height/2)}, 100, null, null, _this.particleColor)
                _this.setClassAnimation('ok', _this.$refs.inputable)
                s_ok.play()
                EventBus.$emit('isok')
                if(_this.oksound!=undefined){
                    var sound = new Howl({ src: [_this.oksound], autoplay:true })
                    setTimeout(function () { sound.play() }, 600)
                }
            }, 100)
        },
        clicksoundsFn () {
            if(this.clickSound!=undefined){
                var sound = new Howl({ src: [this.clickSound], autoplay:true })
            }
            var okerrorsound = null
            if(this.clickErrorSound!=undefined && this.isok != this.status){
                okerrorsound = new Howl({ src: [this.clickErrorSound]})
            }
            else if(this.clickOkSound!=undefined && this.isok == this.status){
                okerrorsound = new Howl({ src: [this.clickOkSound]})
            }
            setTimeout(function () {
                if(okerrorsound){
                    okerrorsound.play()
                }
            }, 600)

        },
        setClassAnimation(name, obj) {

            var _this = this
            var theclass
            obj.children[0].classList.add('animate__animated')
            switch(name) {
                case 'start':
                    theclass = 'animate__rubberBand'
                    break
                case 'error':
                    theclass = 'animate__wobble'
                    break
                case 'ok':
                    theclass = 'animate__rubberBand'
                    break
            }
            obj.children[0].classList.add(theclass)
            setTimeout(function () {
                obj.children[0].classList.remove(theclass)
            }, 1000)
        },

    },
    mounted () {
        //if(this.isok == this.status){this.$emit('input', true)}else{this.$emit('input', false)}
        //this.$refs.clickable.children[0].classList.add('animate__animated')
    }
})