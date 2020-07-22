Vue.component('clickable', {
    props: [
        'value',// v-model | tracking de clickables en la escena
        'clickSound', // sonido al dar click
        'clickErrorSound', // sonido al dar click si es ERROR
        'clickOkSound', // sonido al dar click si es OK
        'oksound', // sonido al dar click si es error
        'errorsound', // sonido al dar click si es ok
        'particleColor', // color de particulas
        'initclass', // class de inicio
        'isok', // es ok?,
        'blockIfError' // Si es error no permitirá que sea seleccionado
    ],
    data() {
        return {
            status: false,
            alreadyOk: false
        }
    },
    template: `
        <div ref="clickable" :class="'clickable ' + (initclass!=undefined?initclass:'') +' '+ (status?'clicked':'') " @click="clicked">
            <slot></slot>
            <embed class="anim" v-if="status" src="../../assets/aanim/Select.svg" />
        </div>
    `,

    methods: {
        clicked (e) {
            if(this.alreadyOk) {
                return false
            }
            var click = this.$refs.clickable
            this.status = !this.status
            this.clicksoundsFn()
            this.isOkOrError(e)
            s_select.play()
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
        isOkOrError (e) {
            if(this.isok == this.status){
                //OK
                //EventBus.$emit('clicked', 'ok')
                this.$emit('input', true)
                this.$emit('wasclicked')
                this.setClassAnimation('ok', this.$refs.clickable)
                if(e){app.particleAnimation({clientX: event.clientX, clientY: event}, 100, null, null, this.particleColor)}
                setTimeout(function(){s_ok.play()},100)
                this.alreadyOk = true
            } else {
                //ERROR
                s_error.play()
                this.setClassAnimation('error', this.$refs.clickable)
                this.blockIfErrorFn()
                this.$emit('input', false)
                //EventBus.$emit('clicked', 'error')
            }
        },
        blockIfErrorFn(){
            if(!this.isok) {
                this.status = false
                return false
            }
        },
        setClassAnimation(name, obj) {
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
                    theclass = 'animate__rubberBand'
                    break
            }
            obj.children[0].classList.add(theclass)
            setTimeout(function () {
                obj.children[0].classList.remove(theclass)
            }, 1000)
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
        }
    },
    mounted () {
        if(this.isok == this.status){this.$emit('input', true)}else{this.$emit('input', false)}
        this.$refs.clickable.children[0].classList.add('animate__animated')
    }
})
