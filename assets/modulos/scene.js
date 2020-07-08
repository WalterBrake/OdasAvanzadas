Vue.component('scene', {
    props: ['current', 'id'],
    template: `
        <section class="scene" v-if="current == id">
        <slot></slot>
        </section>
    `
})
