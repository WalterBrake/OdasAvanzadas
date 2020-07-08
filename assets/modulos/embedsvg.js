Vue.component('embedsvg', {
    props: ['src'],
    data () {
        return {
            body: null
        }
    },
    template: `
        <div class="embedsvg" ref="embed" v-html="body"></div>
    `,
    methods: {
        init(){
            var _this = this
            var req = new XMLHttpRequest()
            req.open('GET', this.src, true)
            req.onload = function () {
                if(req.status >= 200) {
                    _this.body = req.response
                }
            }
            req.send()
        }
    },
    mounted () {
        this.init()
    }
})
