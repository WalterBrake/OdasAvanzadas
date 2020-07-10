Vue.component('info', {
    props: ['title', 'text', 'textaudio', 'type'],
    data () {
        return {
            score: 0
        }
    },
    template: `
        <div class="info">
            <h1>{{title}}</h1>
            <h2><audiotext :text="text" :audio="textaudio" ref="instructions" :autoplay="true" @completed="$emit('completedinstructions')"></audiotext></h2>
            <div class="bottom">
                <scorebox :score="score"></scorebox>
                <div class="instype">
                    <lottie-player v-if="type=='dragdrop'" src="../../assets/lottie/DragNDrop.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='seleccionar'" src="../../assets/lottie/Seleccionar.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
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
    }
})