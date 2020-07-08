Vue.component('info', {
    props: ['title', 'text', 'textaudio', 'type', 'score'],
    template: `
        <div class="info">
            <h1>{{title}}</h1>
            <h2><audiotext :text="text" :audio="textaudio" ref="instructions"></audiotext></h2>
            <div class="bottom">
                <scorebox :score="score"></scorebox>
                <div class="instype">
                    <embed src="../../assets/aanim/DragDrop.svg" v-if="type=='dragdrop'">
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
    }
})