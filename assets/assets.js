/* AUDIOS */
var s_fanf = new Howl({ src: ['../../assets/asound/end.mp3'] })
var s_error = new Howl({ src: ['../../assets/asound/error.mp3'] })
var s_ok = new Howl({ src: ['../../assets/asound/ok.mp3'] })
var s_select = new Howl({ src: ['../../assets/asound/select.mp3'] })
var s_win = new Howl({ src: ['../../assets/asound/win.mp3'] })



/* ################ */
/* VUE INIT */
var EventBus = new Vue()
var ScenesBus = new Vue()

var app = new Vue({
    el: '#app',
    data () {
        return {
            bgimgpdf: '',
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
                screen: []
            },
            scenePointsCounter: 0,
            temporals: [],
            temps: {},
            scoreByScenes: [],
            screen: [],
            timeoutSounds: null,
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
        okFn(){
            EventBus.$emit('isok')
        },
        randomizeArray(rand){
            return rand.sort(function(){return 0.5 - Math.random()})
        },
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
            var _this = this
            if($ev == false){
                //this.currentScene++
                this.temporals = []
                this.notfoundimg()
                for(var hw in Howler._howls){Howler._howls[hw].stop()}
                this.changeSceneTransition(5)
                return false
            }
            var _this = this
            if($ev.oks){ this.finalData.oks += $ev.oks }
            if($ev.errors){ this.finalData.errors += $ev.errors }
            if($ev.answers){ this.finalData.answers += $ev.answers }
            if($ev.score){ this.finalData.score += $ev.score }
            if($ev.scoresum){ this.finalData.scoresum += $ev.scoresum }
            this.screencapture()

            //this.changeSceneTransition()

            this.timeoutSounds = setInterval(this.checkIfSoundsArePlaying, 300)
            
        },
        checkIfSoundsArePlaying(){
            var allmuted = true
            for(var hw in Howler._howls){
                if(Howler._howls[hw].playing()){ allmuted = false }
            }
            if(allmuted){
                clearInterval(this.timeoutSounds)
                this.changeSceneTransition()
            }
        },
        changeSceneTransition(speed){
            let speedpart = speed ? speed : 30
            var _this = this
            var fwIt = 0
            var fw = setInterval(function () {
                fwIt++
                app.particleAnimation({clientX:window.innerWidth/(Math.random()*4), clientY:window.innerHeight/(Math.random()*4)}, 30, null, null)
                if(fwIt == speedpart) {
                    clearInterval(fw)
                    //Stop all howlers
                    for(var hw in Howler._howls){Howler._howls[hw].stop()}
                    EventBus = new Vue()
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
            _this.finalData.screen = _this.screen
            var endData = JSON.stringify(_this.finalData)
            window.top.postMessage(endData, "*")
        },
        cleanstr(str){
            var st = str.toLowerCase().replace(/\s/g,'')
            return st.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        },
        debugg(e){
            console.log(e)
        },
        scenePointsFn () {
            this.scenePointsCounter+=1
            if(this.scenesCount == this.scenePointsCounter) {
                this.scoreInScene += this.decimalSum
            }
        },
        loadScreencap(){
            var s = document.createElement("script")
            s.type = "text/javascript"
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"
            document.head.appendChild(s)
        },
        screencapture () {
            /* screenshot */
            if(document.getElementsByClassName('activity').length>0){
            
                var _this = this
                domtoimage.toPng(document.body).then(function (dataUrl) {
                    _this.screen.push(dataUrl)
                    /*
                    var img = new Image();
                    img.src = dataUrl;
                    document.body.appendChild(img);
                    */
                }).catch(function (error) { console.error('oops, something went wrong!', error); });
            }
        }
    },
    mounted () {
        this.notfoundimg()
        var h = parseInt(window.location.hash ? window.location.hash.replace('#s', '') : 100)
        this.score = h ? h : 100
        ScenesBus.$on('scenePoints', this.scenePointsFn)

        this.bgimgpdf = window.location.hash ? window.location.hash.replace('#img=', '') : ''


        this.loadScreencap()
    }
})



setTimeout(function() {
    document.getElementsByTagName('body')[0].style.display = "block"
}, 250)