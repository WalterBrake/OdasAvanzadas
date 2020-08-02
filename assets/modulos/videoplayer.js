Vue.component('videoplayer', {
    props: [
        'initclass', // clase inicial
        'autoplay', // autoplay
        'c', // color
        'path' // Ruta hacia el archivo (sin extensión, debe haber un mp4 y un webm)

    ],
    data () {
        return {

        }
    },
    template: `
        <div :class="'videoplayer ' + (initclass!=undefined?initclass:'') + ' ' + (c!=undefined?'c'+c:'')" ref="video">
            <video :autoplay="autoplay" playsinline controls class="w100">
                <source :src="path+'.mp4'" type="video/mp4" />
                <source :src="path+'.webm'" type="video/webm" />
            </video>
        </div>
    `,
    mounted() {
        var _this = this
        const player = new Plyr('video', {
            controls: ['play','progress', 'fullscreen'],
            //iconUrl: '../../assets/aanim/plyr.svg'
        })
        player.on('ended', event => {
            _this.$emit('completed')
        });
    }
})

