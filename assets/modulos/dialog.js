Vue.component('dialogaudio', {
    props: ['audio', 'autoplay'],
    data() {
        return {
            playing: false,
            sound: null
        }
    },
    template: `
        <div class="dialogAudio">
            <div class="audiotextBtn">
                <div @click="stop" v-if="playing" ><embed src="../../assets/aanim/Dialog_a.svg" class="animate__animated animate__rubberBand"></embed></div>
                <img v-else src="../../assets/aanim/Dialog.svg" class="animate__animated animate__pulse" @click="play">
            </div>
            <div class="dialog-content">
                <slot></slot>
            </div>
        </div>
    `,
    methods: {
        stop(){
            this.playing = false
            this.sound.stop()
        },
        play () {
            var _this = this
            if(_this.playing){
                return false
            }
            _this.playing = true
            _this.sound.play()
        },
        loadAudio() {
            var _this = this
            _this.sound = new Howl({
                src: [this.audio],
                autoplay: false,
                onplay: function () {

                },
                
                onend: function () {
                    _this.playing = false
                    _this.$emit('completed')
                },
                onstop: function () {
                    _this.playing = false
                }
            });
        }
    },
    mounted () {
        this.loadAudio()
        if(this.autoplay){
            this.play()
        } else {
            for(txt in this.textrender){
                this.textrender[txt].on = true
            }
        }
    }
})