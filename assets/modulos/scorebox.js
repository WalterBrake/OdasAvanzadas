Vue.component('scorebox', {
    props: ['score'],
    data () {
        return {
            scorerender: 0
        }
    },
    template: `
        <div class="scorebox">
            <embed src="../../assets/aanim/ScoreIcon.svg"> 
            <div v-if="scorerender != score">{{scorerender}}</div>
            <div class="animate__animated animate__bounceIn" v-if="scorerender == score">{{scorerender}}</div>
        </div>
    `,
    methods: {
        runscore () {
            var _this = this
            _this.scorerender = 0
            var interval = setInterval(function(){
                if(_this.scorerender < _this.score ){
                    _this.scorerender += 1
                } else {
                    clearInterval(interval)
                    s_end.play()
                }
            }, 10)
        }
    },
    mounted () {
        this.runscore()
        //this.$ref.instructions
    }
})