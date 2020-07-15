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
            scenesCount: 0,
            score: 0,
            scoreInScene: 1,
            currentScene: 0,
            decimalSum: 0,
            finalData:{
                score: 0,
                scoresum: 0,
                oks: 0,
                errors: 0,
                answers: 0,
            },
            temporals: [],
            scoreByScenes: []
        }
    },
    watch: {
        scenesCount (n, o){
            var individual = this.score / this.scenesCount
            var individualR = Math.floor(individual)
            this.decimalSum = (individual * this.scenesCount) - (individualR * this.scenesCount)
            this.scoreInScene = individualR
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
                    if(_this.currentScene == _this.scenesCount-1) {
                        _this.scoreInScene += _this.decimalSum
                    }
                    _this.currentScene++
                    _this.temporals = []
                    _this.notfoundimg()

                    if(_this.currentScene == _this.scenesCount+1) {
                        _this.ended()
                    }
                }
            }, 100)
        },
        ended () {
            var _this = this
            var endData = JSON.stringify(_this.finalData)
            window.top.postMessage(endData, "*")
        },
        debugg(e){
            console.log(e)
        },
    },
    mounted () {
        this.notfoundimg()
        var h = parseInt(window.location.hash ? window.location.hash.replace('#s', '') : 100)
        this.score = h ? h : 100
    }
})