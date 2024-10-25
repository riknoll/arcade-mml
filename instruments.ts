namespace mml {
    //% fixedInstances
    export class MMLInstrument {
        public inst: music.sequencer.Instrument
        constructor(buf: Buffer) {
            this.inst = new music.sequencer.Instrument(buf, 0);
        }
    }

    //% whenUsed fixedInstance
    //% block="dog"
    //% jres="sprites.builtin.dog0"
    export const Dog = new MMLInstrument(hex`010a006400f4016400000400000000000000000000000000050000`);
    //% whenUsed fixedInstance
    //% block="duck"
    //% jres="sprites.duck.duck1"
    export const Duck = new MMLInstrument(hex`0f05001202c102c201000405002800000064002800030000060000`);
    //% whenUsed fixedInstance
    //% block="cat"
    //% jres="sprites.builtin.cat0"
    export const Cat = new MMLInstrument(hex`0c960064006d019001000478002c010000640032000000000a0000`);
    //% whenUsed fixedInstance
    //% block="fish"
    //% jres="sprites.builtin.clownFish0"
    export const Fish = new MMLInstrument(hex`01dc00690000045e01000400000000000000000000050000010000`);
    //% whenUsed fixedInstance
    //% block="car"
    //% jres="sprites.vehicle.carRedLeft"
    export const Car = new MMLInstrument(hex`100500640000041e000004000000000000000000000000000a0000`);
    //% whenUsed fixedInstance
    //% block="computer"
    //% jres="sprites.builtin.computer1"
    export const Computer = new MMLInstrument(hex`0f0a006400f4010a00000400000000000000000000000000000000`);
    //% whenUsed fixedInstance
    //% block="burger"
    //% jres="sprites.food.smallBurger"
    export const Burger = new MMLInstrument(hex`010a006400f4016400000400000000000000000000000000000000`);
    //% whenUsed fixedInstance
    //% block="cherry"
    //% jres="sprites.food.smallCherries"
    export const Cherry = new MMLInstrument(hex`020a006400f4016400000400000000000000000000000000000000`);
    //% whenUsed fixedInstance
    //% block="lemon"
    //% jres="sprites.food.smallLemon"
    export const Lemon = new MMLInstrument(hex`0e050046006603320000040a002d00000064001400010000020000`);
}
