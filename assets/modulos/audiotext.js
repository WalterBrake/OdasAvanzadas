Vue.component('audiotext', {
    props: ['text', 'audio'],
    data() {
        return {
            playing: false,
            textrender: [],
            wordcount: 0,
            speedtime: 0,
        }
    },
    template: `
        <div class="audiotext">
            <div class="audiotextBtn">
                <img v-if="!playing" src="../../assets/aanim/Dialog.svg" class="animate__animated animate__pulse" @click="playit">
                <embed v-if="playing" src="../../assets/aanim/Dialog_a.svg" class="animate__animated animate__rubberBand"></embed>
            </div>
            <div class="audiotextTxt">
                <div v-for="txt in textrender" :class="txt.on ? 'on' : 'off' ">{{txt.txt}} &nbsp;</div>
            </div>
        </div>
    `,
    methods: {
        textanimation (duration) {
            for(w in this.textrender) { this.textrender[w].on = false }
            var _this = this
            var speedtime = (duration*1000) / (_this.textrender.length)
            var counted = 0
            
            var interval = setInterval(function(){
                _this.textrender[counted].on = true
                counted++
                if(counted == _this.textrender.length){
                    clearInterval(interval)
                }
            }, speedtime/1.5)
        },
        playit () {
            var _this = this
            if(_this.playing){
                return false
            }
            _this.playing = true
            var sound = new Howl({
                src: [this.audio],
                autoplay: true,
                onload: function () {
                    _this.textanimation(sound.duration())
                },
                onend: function () {
                    _this.playing = false
                }
            });
        },
        separatetxt () {
            var _this = this
            _this.textrender = []
            var words = _this.text.split(" ")
            for(var w in words){
                _this.textrender.push({txt:words[w], on: false})
            }
        }
    },
    mounted () {
        this.separatetxt()
        this.playit()
    }
})