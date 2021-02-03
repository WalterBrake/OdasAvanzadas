Vue.component('info', {
    props: ['title', 'text', 'textaudio', 'type', 'autoplay'],
    data () {
        return {
            score: 0,
            showPlayer: true,
        }
    },
    template: `
        <div class="info">
            <h1>{{title}}</h1>
            <template v-if="showPlayer">
                <h2><audiotext :text="text" :audio="textaudio" ref="instructions" :autoplay="autoplay!=undefined ? autoplay : true" @completed="$emit('completedinstructions')"></audiotext></h2>
            </template>
            <slot></slot>
            <div class="bottom">
                <scorebox :score="score"></scorebox>
                <div class="instype">
                    <lottie-player v-if="type=='dragdrop'" src="../../assets/lottie/DragNDrop.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='seleccionar'" src="../../assets/lottie/Seleccionar.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='relacionar'" src="../../assets/lottie/Relacionar.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='input'" src="../../assets/lottie/Input.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='keydown'" src="../../assets/lottie/Keydown.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                </div>
            </div>
            <button class="reset button" @click="reset">Reiniciar</button>
        </div>
    `,
    methods: {
        reset () { location.reload() }
    },
    mounted () {
        //this.$ref.instructions
        this.score = this.$parent.score
    },
    created () {
        if(this.textaudio == undefined){
            this.showPlayer = false
        }
    }
})