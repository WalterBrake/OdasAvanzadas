Vue.component('activity', {
    props: ['title', 'instruction', 'type', 'score'],
    template: `
        <div class="activity">
            <slot></slot>
        </div>
    `
})