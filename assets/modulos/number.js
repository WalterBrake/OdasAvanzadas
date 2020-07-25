Vue.component('number', {
    props: [
        'initclass', // clase inicial
        'small', // tamano pequeno
        'c', // valor que se compara con el campo answer de options
        'randomc', //color aleatorio
    ],
    data () {
        return {

        }
    },
    template: `
        <div :class="
            'number ' +
            (initclass!=undefined?initclass:'') + ' ' +
            (small!=undefined?'small':'') + ' ' +
            (c!=undefined?'c'+c:'') + ' ' +
            ranc
            " >
            <slot />
        </div>
    `,
    computed: {
        ranc() {
            if(this.randomc!=undefined){
                return 'c' + (Math.round(Math.random()*7)+1)
            } else {
                return false
            }
        }
    }
})


/*
<number small c="1">Uno</number>
<number c="2">Uno</number>
<number randomc>Uno</number>
*/