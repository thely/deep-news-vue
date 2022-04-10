/* eslint-disable no-unused-vars */
import patchList from "./HydraMixer.js";
const Hydra = require("hydra-synth");

class HydraHandle {
  constructor() {
    const h = this.initPatch("#hydra-large", 800, 400, this.randomPatch());
    const h2 = this.initPatch("#hydra-small", 400, 300, this.randomPatch());

    this.patches = [h, h2];
  }

  initPatch(canvasID, width, height, func) {
    const h = new Hydra({
      makeGlobal: false,
      detectAudio: false,
      canvas: document.querySelector(canvasID),
      width: width,
      height: height,
    }).synth;

    h.setResolution(width, height);
    h.patch = func;

    return h;
  }

  runAll(data) {
    for (let i = 0; i < this.patches.length; i++) {
      // this.patches[i].patch(this.patches[i]);  
      this.runOne(i);
    }
  }

  runOne(index) {
    this.patches[index].patch(this.patches[index]);
  }

  videoNotify(player, patch) {
    // console.log("notify hydra: video " + player + " to patch " + patch);
    this.patches[patch].s0.init({ src: player, dynamic: true });
  }

  changePatches() {
    this.patches[0].patch = this.randomPatch();
    this.patches[1].patch = this.randomPatch();

    this.runAll();
  }

  randomPatch() {
    console.log(patchList);
    const p = patchList[Math.floor(Math.random() * patchList.length)];
    console.log(p);
    return p;
  }
}

export default HydraHandle;


// function run1(h) {
//   h.src(h.s0)
//     .modulate(h.voronoi(({time}) => 100+(100*Math.sin(time*0.1)).mult(h.osc(10,0.1,0.5)), 1, 1))
//     .mult(h.o0, 0.1)
//     .scale(0.5)
//     .color(({time}) => 1*(Math.sin(time*0.21)), ({time}) => 0.25*(Math.sin(time*0.2)),1)
//     .out(h.o0);

//   h.src(h.o0)
//     .color(1, 1.1,1)
//     .contrast(1.5)
//     .modulate(h.o0, 0.5)
//     .saturate(1.5)
//     .diff(h.src(h.s0).modulateHue(h.src(h.o0).scale(1.01),1)
//     .layer(h.osc(1,0.5,10).mask(h.shape(4,1,0.001).diff(h.src(h.s0,0.5).repeat(4)))),0.5)
//     .out(h.o1);
    
//   h.render(h.o1);
// }

// function run2(h) {
//   h.src(h.s0)
//     .modulatePixelate(h.voronoi(100,0.3,1000).pixelate(20,20),({time}) => 400+(250*(Math.sin(time*0.1))),8)
//     .diff(h.src(h.s0).modulateHue(h.src(h.o0).colorama(0.1)).scale(1.01),20)
//     .luma(0.1,0.1).colorama(0.1).mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),0.1)
//     .out(h.o0)

//     h.render(h.o0)
// }

// function run3(obj) {
//   const h = this;
//   // base = base ? base : 1.5;
//   // const post = base * 10;
  
//   h.src(h.o0)
//     .modulate(
//       h.osc(10,0,obj.freqVal).modulate(h.src(h.s0).sub(h.gradient()),obj.freqVal).brightness(-0.5)
//     ,obj.modVal)
//     .blend(h.src(h.s0).hue(({time}) => Math.sin(time*0.001)).posterize(20,4).contrast(1.5),0.01)
//     .out(h.o0)

//   h.render(h.o0);
// }

// function run4(obj) {
//   const h = this;
//   // base = base ? base : 1.4;
//   h.src(h.o0)
//     .color(1,-0.2,-0.2)
//     .modulate(h.o0, ({time}) => Math.sin(time*0.01)*0.01)
//     .contrast(1.17)
//     .saturate(1.03)
//     .blend(h.src(h.s0).color(1,obj.freqVal,1).luma(0.5,0.3), 0.25)
//     .modulateHue(h.src(h.o0).modulate(h.noise(100),5),10)
//     .out(h.o0);

//   h.render(h.o0);
// }

// function run5(h) {
//   h.src(h.s0)
//     .hue(({time}) => Math.sin(time*0.1))
//     .posterize(20,4)
//     .modulate(h.o0,0.5)
//     .out(h.o0)
// }