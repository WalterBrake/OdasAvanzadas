/* AUDIOS */
var s_fanf = new Howl({ src: ['../../assets/asound/end.mp3'] })
var s_error = new Howl({ src: ['../../assets/asound/error.mp3'] })
var s_ok = new Howl({ src: ['../../assets/asound/ok.mp3'] })
var s_select = new Howl({ src: ['../../assets/asound/select.mp3'] })
var s_win = new Howl({ src: ['../../assets/asound/win.mp3'] })



/* ################ */
/* VUE INIT */
var EventBus = new Vue()

var app = new Vue({
    el: '#app',
    data () {
        return {
            $devmode: false,
            currentScene: 0,
            finalData:{
                score: 0,
                scoresum: 0,
                oks: 0,
                errors: 0,
                answers: 0,
            },
            temporals: []
        }
    },
    methods: {
        reset () { location.reload() },
        notfoundimg () {
            document.addEventListener("DOMContentLoaded", function(event) {
                document.querySelectorAll('img').forEach(function(img){
                   img.onerror = function(){this.src='../../assets/aanim/notfound.svg';};
                })
             });
        },
        particleAnimation(e, num, time, size, onecolor) {
            if(e) {
                render.play();
                updateCoords(e);
                animateParticules(pointerX, pointerY, num, time, size, onecolor);
            }
        },
        sceneCompleted($ev){
            if($ev == false){
                this.currentScene++
                this.temporals = []
                this.notfoundimg()
                return false
            }
            var _this = this
            if($ev.oks){ this.finalData.oks += $ev.oks }
            if($ev.errors){ this.finalData.errors += $ev.errors }
            if($ev.answers){ this.finalData.answers += $ev.answers }
            if($ev.score){ this.finalData.score += $ev.score }
            if($ev.scoresum){ this.finalData.scoresum += $ev.scoresum }
            
            var fwIt = 0
            var fw = setInterval(function () {
                fwIt++
                app.particleAnimation({clientX:window.innerWidth/(Math.random()*4), clientY:window.innerHeight/(Math.random()*4)}, 30, null, null)
                if(fwIt == 30) {
                    clearInterval(fw)
                    //Stop all howlers
                    //for(var hw in Howler._howls){Howler._howls[hw].stop()}
                    EventBus = new Vue()
                    _this.currentScene++
                    _this.temporals = []
                    _this.notfoundimg()
                }
            }, 100)


        },
        debugg(e){
            console.log(e)
        },
    },
    mounted () {
        this.notfoundimg()
    }
})