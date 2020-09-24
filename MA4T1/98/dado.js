Vue.component('dado',{
    props: ['nobtn', 'color'],
    data() { return {
        illustration: null,
        dice: null,
        faces: null,
        gotopos: {x:1, y:1, z:1},
        lerpanim: 0,
        playedsound: true,
        dicesound: null,
        dicesound2: null
    } },
    methods: {
        dicePosition(pos){
            var _this = this
            _this.dicesound.play()
            _this.dicesound2.play()
            _this.$emit('isrolling', true)
            switch(pos){
                case 1: 
                    _this.gotopos= {x:1, y:1, z:1}
                    break;
                case 2: 
                _this.gotopos= {x:4, y:1, z:1}
                    break;
                case 3: 
                    _this.gotopos= {x:1, y:4, z:1}
                    break;
                case 4: 
                    _this.gotopos= {x:1, y:-4, z:1}
                    break;
                case 5:
                    _this.gotopos= {x:-4, y:1, z:1}
                    break;
                case 6: 
                    _this.gotopos= {x:1, y:2, z:1}
                    break;
            }
            this.lerpanim = 0
            this.playedsound = false

        },
        init(){
            const { Illustration, Group, Anchor, Rect, TAU, Ellipse, RoundedRect } = Zdog
            this.illustration = new Illustration({
                element: '.zdog-canvas',
                dragRotate: true,
            });

            this.dice = new Anchor({
                addTo: this.illustration
            })
            this.faces = new Group({
                addTo: this.dice,
            })

            const face = new Rect({
                addTo: this.faces,
                stroke: 50,
                width: 50,
                height: 50,
                color: this.color,
                fill: this.color,
                translate: {
                    z: -25,
                },
            })
            face.copy({
                rotate: {
                    x: TAU / 4,
                },
                translate: {
                    y: 25,
                },
            })

            face.copy({
                rotate: {
                  x: TAU / 4,
                },
                translate: {
                  y: -25,
                },
              });
              
              face.copy({
                translate: {
                  z: 25,
                },
              });

              /* DOTS */
              const one = new Ellipse({
                addTo: this.dice,
                diameter: 15,
                stroke: false,
                fill: true,
                color: 'hsl(0, 0%, 100%)',
                translate: {
                  z: 50,
                },
              });
              const two = new Group({
                addTo: this.dice,
                rotate: {
                  x: TAU / 4,
                },
                translate: {
                  y: 50,
                },
              });
              
              one.copy({
                addTo: two,
                translate: {
                  y: 20,
                },
              });
              
              one.copy({
                addTo: two,
                translate: {
                  y: -20,
                },
              });


              const three = new Group({
                addTo: this.dice,
                rotate: {
                  y: TAU / 4,
                },
                translate: {
                  x: 50,
                },
              });
              
              one.copy({
                addTo: three,
                translate: {
                  z: 0,
                },
              });
              
              one.copy({
                addTo: three,
                translate: {
                  x: 20,
                  y: -20,
                  z: 0,
                },
              });
              
              one.copy({
                addTo: three,
                translate: {
                  x: -20,
                  y: 20,
                  z: 0,
                },
              });
              
              const four = new Group({
                addTo: this.dice,
                rotate: {
                  y: TAU / 4,
                },
                translate: {
                  x: -50,
                },
              });
              
              two.copyGraph({
                addTo: four,
                rotate: {
                  x: 0,
                },
                translate: {
                  x: 20,
                  y: 0,
                },
              });
              
              two.copyGraph({
                addTo: four,
                rotate: {
                  x: 0,
                },
                translate: {
                  x: -20,
                  y: 0,
                },
              });
              
              const five = new Group({
                addTo: this.dice,
                rotate: {
                  x: TAU / 4,
                },
                translate: {
                  y: -50,
                },
              });
              
              four.copyGraph({
                addTo: five,
                rotate: {
                  y: 0,
                },
                translate: {
                  x: 0,
                },
              });
              
              one.copy({
                addTo: five,
                translate: {
                  z: 0,
                },
              });
              
              const six = new Group({
                addTo: this.dice,
                translate: {
                  z: -50,
                },
              });
              
              two.copyGraph({
                addTo: six,
                rotate: {
                  x: 0,
                  z: TAU / 4,
                },
                translate: {
                  x: 0,
                  y: 0,
                },
              });
              
              four.copyGraph({
                addTo: six,
                rotate: {
                  y: 0,
                },
                translate: {
                  x: 0,
                },
              });

            
              this.animate()
            
        },
        animate () {
            this.illustration.updateRenderGraph();
            //this.dice.rotate.x += 0.01;
            //this.dice.rotate.y -= 0.01;

            if(this.lerpanim<1){
                this.lerpanim+=.01
            }

            if(this.lerpanim<=.3){
                this.illustration.rotate.lerp({
                    x:Zdog.TAU/(Math.random*16),
                    y:Zdog.TAU/(Math.random*16),
                    z:Zdog.TAU/(Math.random*16)
                }, this.lerpanim)
            } else if(this.lerpanim>.3){
                this.illustration.rotate.lerp({
                    x:Zdog.TAU/this.gotopos.x,
                    y:Zdog.TAU/this.gotopos.y,
                    z:Zdog.TAU/this.gotopos.z
                }, this.lerpanim)
            }

            if(Math.round(this.lerpanim)==1 && !this.playedsound){
                this.playedsound = true
                s_select.play()
                this.$emit('isrolling', false)
            }

            requestAnimationFrame(this.animate);
        },
        girardado(){
            var randomdice = Math.round(Math.random()*5)+1
            this.dicePosition(randomdice)
        }
    },
    template: `
        <div class="dice">
            <canvas class="zdog-canvas" width="160" height="160"></canvas>
            <button class="button" @click="girardado" v-if="nobtn==undefined">girar</button>
        </div>
        `,
    mounted () {
        if(this.color==undefined){
            this.color = '#5EB247'
        }

        this.init()
        this.dicesound =  new Howl({ src: ['asound/dice.mp3'] })
        this.dicesound2 =  new Howl({ src: ['asound/salto.mp3'] })

    }
})