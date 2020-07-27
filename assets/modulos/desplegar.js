Vue.component('desplegar', {
    props: [
        'initclass', // clase inicial
        'options', // array de opciones que se duplicará
        'answer', // valor que se compara con el campo answer de options
        'showOk', // Cuando OK todos los ERROR se ocultan
        'modalOptions', //Mostrar las opciones "flotando"
    ],
    data () {
        return {
            status: null,
            selected: null,
            desplegaropt: null
        }
    },
    template: `
        <div :class="'desplegar ' + (initclass!=undefined?initclass:'') + ' ' + (status ? status : '') ">
            <div class="deployer" v-if="status==null" @click="status='open'"></div>
            <div v-if="optionsVisible" :class="optionsClasses">
                <template  v-for="(opt,index) in desplegaropt">
                    <div :class="'option ' + (selected == opt.answer ? 'ok':'') " :ref="'opt'+index" @click="clicked('opt'+index, opt.answer)" >
                        <slot name="option" :option="opt" />
                        <embed class="anim" v-if="selected == opt.answer " src="../../assets/aanim/Select.svg" />
                    </div>
                </template>
            </div>
        </div>
    `,
    computed: {
        optionsClasses () {
            var showok = this.showOk!=undefined && this.status == 'ok' ? 'showok' : ''
            var modal = this.modalOptions!=undefined && this.status != 'ok' ? 'modaloptions' : ''
            return 'options ' + showok + ' ' + modal + ' ' + this.status
        },
        optionsVisible() {
            if(this.showOk != undefined) {
                if(this.status == 'open' || this.status == 'ok') {
                    return true
                } else {
                    return false
                }
            }
        }
    },
    methods: {
        clicked(ref, optionAnswer){
            if(this.selected != null){
                return false
            }
            if(optionAnswer == this.answer) {
                
                // OK
                this.selected = optionAnswer
                EventBus.$emit('isok')
                this.$emit('wasclicked')
                this.setClassAnimation('ok', this.$refs[ref][0])
                s_ok.play()
                this.status = 'ok'
                var _this = this
                setTimeout(function (){
                    _this.$refs[ref][0].classList.add('invoker')
                    console.log(_this.$refs[ref])
                }, 200)
            } else {
                //ERROR
                s_error.play()
                this.setClassAnimation('error', this.$refs[ref][0])
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
            obj.children[0].classList.add('animate__animated')
            obj.children[0].classList.add(theclass)
            setTimeout(function () {
                obj.children[0].classList.remove(theclass)
            }, 1000)
        },
        array2obj () {
            var array2obj = []
            for(op in this.options){
                var opt = this.options[op]
                if(typeof opt === 'object') {
                } else {
                    array2obj.push( {answer: opt, text: opt} )
                }
            }
            this.desplegaropt = array2obj.length ? array2obj : this.options
        }
    },
    mounted () {
        this.array2obj()
    }
})