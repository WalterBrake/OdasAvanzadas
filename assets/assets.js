/* AUDIOS */
var s_end = new Howl({ src: ['../../assets/asound/end.mp3'] });
var s_error = new Howl({ src: ['../../assets/asound/error.mp3'] });
var s_ok = new Howl({ src: ['../../assets/asound/ok.mp3'] });
var s_select = new Howl({ src: ['../../assets/asound/select.mp3'] });
var s_win = new Howl({ src: ['../../assets/asound/win.mp3'] });



/* ################ */
/* VUE INIT */
var app = new Vue({
    el: '#app',
    data () {
        return {
            current: 1,
            score: 150,
            r: [],
            right: 0,
            total: 0,
            resultado: false,
        }
    },
    methods: {
        reset () { location.reload() },
        finalizar () {
            s_win.play()
            this.total = this.r.length
            for(var i in this.$refs){
                this.$refs[i].verify()
            }
            this.resultado = true
        },
        okFn() {
            console.log('OK!')
        },
        errorFn() {
            console.log('Error!')
        }
    }
})