var EventBus = new Vue()

Vue.component('scene', {
    props: [
        'answers', // total de respuestas
        'score', //puntaje de actividad
        'alloks', // todas deben estar ok para avanzar
        'alloksSound', //sonido cuando todos ok
        'sceneColor', //Color principal de la escena
        'devmode', // Activa modo developer con botones para las funciones
        'startScene', // Es la escena de inicio
        'endScene', // Es la escena del final
        'finalData', //Resultados finales sólo para endScene
    ],
    data() {
        return {
            appearok: false,
            currentAnswers: 0,
            oks: 0,
            errors: 0,
            comenzarBtnClicked: false
        }
    },
    template: `
        <section class="scene" v-if="appearok">
            <div v-if="startScene!=undefined" class="startScene">
                <button @click="comenzarFn" :disabled="comenzarBtnClicked" class="button">comenzar</button>
            </div>
            <div v-if="endScene!=undefined" class="endScene text-center">
                <h1>Felicidades</h1>
                <h2>Completaste la actividad</h2>
                <scorebox :score="finalData.scoresum"></scorebox>
                <p class="endResults">Obtuviste <strong>{{finalData.oks}} respuestas correctas</strong>.</p>
                <template v-if="finalData.score != finalData.scoresum">
                    <p class="endResultErrors">Tuviste problemas con {{finalData.errors}} respuestas.</p>
                    <p class="endImprove">Puedes mejorar tu puntaje repitiendo la actividad.</p>
                </template>
                <button @click="reset" class="button">Repetir actividad</button>
            </div>
            <template v-if="startScene==undefined && endScene==undefined">
                <slot></slot>
                <div class="scenebar">
                    <scorebox :showmax="score" :score="scoresum"></scorebox>
                </div>
                <div v-if="devmode" class="devmode">
                    <button @click="okFn">okFn</button>
                    <button @click="errorFn">errorFn</button>
                    <button @click="oks=answers; endedFn()">endAll Ok</button>
                    <button @click="oks=answers-1; errors=1; currentAnswers=answers; endedFn()">endOne Bad</button>
                </div>
            </template>
        </section>
    `,
    computed: {
        scoresum () {
            return Math.round((this.score / this.answers) * this.oks)
        }
    },
    methods: {
        comenzarFn(){
            this.comenzarBtnClicked = true
            this.$emit('completed', {oks: null, errors: null, answers: null, score: null, scoresum: null})
            s_fanf.play()
        },
        okFn() {
            this.oks++
            this.currentAnswers++
            this.endedFn()
        },
        errorFn() {
            this.errors++
            this.currentAnswers++
            this.endedFn()
        },
        endedFn () {
            if(this.alloks != undefined) {
                if(this.oks == this.answers) {
                    this.$emit('completed', {oks: this.oks, errors: this.errors, answers: this.answers, score: this.score, scoresum: this.scoresum})
                    if(this.alloksSound){
                        console.log('allok')
                        var sound = new Howl({ src: [this.alloksSound] })
                        app.particleAnimation({clientX:window.innerWidth / 2, clientY:window.innerHeight / 2}, 100, 5000, 100)
                        setTimeout(function(){
                            s_win.play()
                        },200)
                        setTimeout(function(){
                            sound.play()
                        },600)
                    }
                }
            } else {
                if(this.currentAnswers == this.answers) {
                    this.$emit('completed', {oks: this.oks, errors: this.errors, answers: this.answers, score: this.score, scoresum: this.scoresum})
                }
            }
            
        },
        appear() {
            var _this = this
                app.particleAnimation({clientX:window.innerWidth / 2, clientY:window.innerHeight / 2}, 80, 5000, 800, _this.sceneColor)
                _this.appearok = true
        },
        reset () { location.reload() },

    },
    mounted () {
        EventBus.$on('isok', this.okFn)
        EventBus.$on('iserror', this.errorFn)
        if(app){
            this.appear()
        } else {
            this.appearok = true
        }
        console.log(this.startScene)
    }
})
