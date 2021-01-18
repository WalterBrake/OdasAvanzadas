Vue.component('selectives', {
    props: ['ops', 'ans', 'number', 'disableok'],
    data () {
        return {
            selected: null,
            validateok: false
        }
    },
    methods: {
        clicked (index){
            this.selected = index
            s_select.play()
        },
        validate () {
            if(this.ans == this.selected){
                if(this.disableok==undefined){
                    s_ok.play()
                    EventBus.$emit('isok')
                }
                this.$emit('isok')
                this.validateok = true
                return true
            } else {
                if(this.disableok==undefined){
                    s_error.play()
                }
                this.$emit('iserror')
                this.selected = null
                return false
            }
        }
    },
    template: `
        <div class="selectives">
            <div class="row w100 wrap">
                <template v-for="(i, index) in ops">
                    <template v-if="number!=undefined">
                        <div @click="clicked(index)" class="pa-1" :class="index == selected ? 'on':'off'"><number randomc smaller>{{i}}</number></div>
                    </template>
                    <template v-else>
                        <div @click="clicked(index)" :class="index == selected ? 'on':'off'" v-html="i"></div>
                    </template>
                </template>
            </div>
        </div>
    `
})