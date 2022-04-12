/* eslint-disable no-unused-vars */
import patchList from "./HydraMixer.js";
const Hydra = require("hydra-synth");

class HydraHandle {
  constructor() {
    const h = this.initPatch("#hydra-large", 800, 450, this.randomPatch());
    const h2 = this.initPatch("#hydra-small", 400, 225, this.randomPatch());

    this.patches = [h, h2];
  }

  initPatch(canvasID, width, height, func) {
    const h = new Hydra({
      makeGlobal: false,
      detectAudio: false,
      canvas: document.querySelector(canvasID),
      width: width,
      height: height,
      numSources: 1,
      autoLoop: false
    }).synth;

    h.setResolution(width, height);
    h.patch = func;

    setInterval(() => {
      h.tick(200);
    }, 200);

    return h;
  }

  runAll(data) {
    for (let i = 0; i < this.patches.length; i++) {
      this.runOne(i, data);
    }
  }

  runOne(index, data) {
    this.patches[index].patch(this.patches[index], data);
  }

  videoNotify(player, patch) {
    this.patches[patch].s0.init({ src: player, dynamic: true });
  }

  changePatches(data) {
    this.patches[0].patch = this.randomPatch();
    this.patches[1].patch = this.randomPatch();

    this.runAll(data);
  }

  randomPatch() {
    const p = patchList[Math.floor(Math.random() * patchList.length)];
    return p;
  }
}

export default HydraHandle;