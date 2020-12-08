Vue.component('sequence', {
    props: ['options', 'initclass', 'autoplay', 'noNav'],
    data () {
        return {
            current: 0
        }
    },
    methods: {
        adelante (){
            if(this.current==this.options.length-1){
                console.log('last')
                return false
            }
            this.current++
            this.changedCurrent()
        },
        atras () {
            this.current--
            this.changedCurrent()
        },
        changedCurrent(){
            for(var hw in Howler._howls){Howler._howls[hw].stop()}
            s_select.play()
            if(this.current == this.options.length-1){
                this.$emit('completed')
            }
            if(this.current == this.options.length-1){
                this.$emit('last')
            }
        }
    },
    template: `
        <div :class="'sequence ' + (initclass?initclass:' ')">
            
            <div v-for="(option, index) in options" v-show="index == current">
                <slot name="option" :option="option" />
            </div>

            <div class="sequence_nav" v-if="noNav==undefined">
                <!--disabled-->
                <button class="button" v-if="current==0" disabled>Atras</button>
                <!--navigations-->
                <button class="button big" v-if="current>0" @click="atras">Atras</button>


                <!-- #### adelante --->
                <button class="button big animate__animated animate__pulse animate__infinite" v-if="current==0" @click="adelante">Adelante</button>
                <button class="button big" v-else-if="current<(options.length-1)" @click="adelante">Adelante</button>
                <!--disabled-->
                <button class="button" v-if="current==(options.length-1)" disabled>Adelante</button>
            </div>
        </div>
    `

})