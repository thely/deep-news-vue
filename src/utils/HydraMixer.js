/* eslint-disable no-unused-vars */

//Patch1
function patch1(h, data) {
  let v1, v2, v3, v4;

  if (data != null) {
    v1 = data.currentStockShares != 0 ? (data.currentStockShares % 10) / 5 : 0.1;
    v2 = data.currentStockClose != 0 ? (data.currentStockClose % 300) / 10 : 0.3;
    v3 = data.messageLength != 0 ? data.messageLength * 100 : 100;
    v4 = data.clickCount != 0 ? data.clickCount * 2 % 50 : 20;
  } else {
    v1 = 0.1;
  }

  // console.log(v4);
  
  h.src(h.s0)
    .modulatePixelate(h.voronoi(40,100,v3).pixelate(v4,v4),({time}) => 400+(250*(Math.sin(time*0.1))),8)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).colorama(0.1)).scale(1.01),20)
    .luma(v1,v1)
    .colorama(({time}) => v1 +(0.075*(Math.sin(time*0.5)))) //0.1, 0.01-0.15
    .mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),v1)
    .out(h.o0)
  h.render(h.o0)
}

function patch2(h, data) {
  let v1, v2, v3;

  if (data != null) {
    v1 = 0.0015;
    v2 = 0.04;
    v3 = 10;

    v1 = data.clickCount != 0 ? (Math.max(1, data.clickCount % 7)) * 15 / 5000.0 : 0.002;
    v2 = data.currentStockClose != 0 ? (data.currentStockClose % 200) / 400 : 0.04;
    v3 = data.messageLength != 0 ? (data.messageLength % 40) : 10;
  } else {
    v1 = 0.0015;
    v2 = 0.04;
  }

  h.src(h.o0)
    .modulate(h.osc(v3,0,1.5).modulate(h.src(h.s0).sub(h.gradient()),1.5).brightness(-0.5), v1) //modulate amnt: 0.003, 0.001, 0.0015,0.002, started at 0.0015
    .blend(h.src(h.s0).hue(({time}) => Math.sin(time*0.001)).posterize(20,4).contrast(1.5), v2) //blend amt: 0.01,0.04,0.001, starts at 0.04
    .out(h.o0)
  h.render(h.o0)
}

function patch3(h, data) {
  let v1, v2, v3;

  if (data != null) {
    const close = data.currentStockClose != 0 ? (data.currentStockClose % 20) / 20 : 0.5;
    const click = (data.clickCount % 10) / 10;
    const msgLen = data.messageLength != 0 ? (data.messageLength % 20 / 20) : 0.5;

    v1 = close <= 0.33 ? 1 : close <= 0.66 ? 0.5 : 0.01;
    v2 = click <= 0.33 ? 100 : click <= 0.66 ? 500 : 1000;
    v3 = msgLen <= 0.33 ? 10 : msgLen <= 0.66 ? 100 : 1000;

    // v1 = data.freqVal <= 33 ? 1 : data.freqVal <= 66 ? 0.5 : 0.01;
    // v2 = data.modVal <= 33 ? 100 : data.modVal <= 66 ? 500 : 1000;
  } else {
    v1 = 0.5;
    v2 = 100;
  }

  //Patch3
  h.src(h.o0)
    .color(1,-0.2,-0.2)
    .modulate(h.src(h.o0).rotate(({time}) => (time*0.1)%360), ({time}) => Math.sin(time*0.01)*0.01)
    .contrast(1.17)
    .saturate(1.03) //1.03
    .blend(h.src(h.s0).color(1,1.4,1).luma(0.5,0.3), v1) //threshold: discrete values: [1,0.5,0.01], was once 0.25
    .modulateHue(h.src(h.o0).modulate(h.noise(v3),5),v2) // granurality: discret values: [10,100,1000]
    .out(h.o0);
  h.render(h.o0)
}

function patch4(h, data) {
  let v1, v2;

  if (data != null) {
    // v1 = 0.5;
    // v2 = data.modVal / 500.0;
    v1 = data.currentStockClose != 0 ? ((data.currentStockClose % 20) / 20) : 0.5;
    const click = (data.clickCount % 10) / 10;
    v2 = click <= 0.33 ? 0.1 : click <= 0.66 ? 1 : 50;
  } else {
    v1 = 0.5;
    v2 = 100;
  }

  // console.log(v1, v2);
  //Patch4
  h.src(h.s0)
    .hue(({time}) => Math.sin(time * v1)) // hue speed: Math.sin(time*speed), discret values :[1, 100]
    .posterize(20,4) // originally 20
    .modulate(h.o0,({time}) => 500+(0.5*Math.sin(time * v2))) //speed: Math.sin(time*speed), discret values: [0.1, 1 ,50]
    .out(h.o0)
  h.render(h.o0)
}

function patch5(h, data) {
  let v1, v2, v3;

  if (data != null) {
    // v1 = data.freqVal / 500.0;
    v1 = data.clickCount != 0 ? (data.clickCount % 10) / 10 : 0.1;
    v2 = data.currentStockClose != 0 ? (data.currentStockClose % 100) / 10 : 0.25;
    v3 = data.messageLength != 0 ? (data.messageLength % 10) / 10 : 0.5;
  } else {
    v1 = 0.1;
    v2 = 0.25;
    v3 = 0.5;
  }

  //Patch5
  h.src(h.s0)
    .modulate(h.voronoi(({time}) => 100 + (100 * Math.sin(time * 0.1)), 1, 1))
    .mult(h.osc(10,v1,0.5))
    .mult(h.o0, 0.1) // orig 0.1
    .scale(0.5)
    .color(({time}) => 1*(Math.sin(time*0.21)), ({time}) => v2 * (Math.sin(time*0.2)),1) // it was originally 0.25
    .color(1, 1.1,1)
    .contrast(1.5)
    .modulate(h.o0, v3) // orig 0.5
    .saturate(1.5)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).scale(1.01),1)
    .layer(h.osc(1,0.5,10).mask(h.shape(4,1,0.001).diff(h.src(h.s0,0.5).repeat(4)))),0.5)
    .out(h.o0);
  h.render(h.o0)
}

function patch1p3(h, data) {
  let v1, v2, v3;

  if (data != null) {
    // v1 = data.freqVal / 500.0;
    v1 = data.clickCount != 0 ? (data.clickCount % 10) / 10 : 0.3;
    v2 = data.currentStockClose != 0 ? (data.currentStockClose % 100) / 1000 : 0.1;
    // v3 = data.messageLength != 0 ? (data.messageLength % 10) / 10 : 0.5;
  } else {
    v1 = 0.1;
    v2 = 0.25;
    v3 = 0.5;
  }

  //Patch1+3
  h.src(h.s0)
    .modulatePixelate(h.voronoi(100,0.3,1000).pixelate(20,20),({time}) => 400+(250*(Math.sin(time*0.1))),8) //h.voronoi(100,0.3,1000).pixelate(20,20), h.voronoi(100,0.3,1).pixelate(20,2), voronoi(100,0.3,1).pixelate(2,20)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).colorama(0.1)).scale(1.01),20)
    .luma(0.1,0.1)
    .colorama(({time}) => 0.75+(0.75*(Math.sin(time*v2)))) //0.1, 0.01-0.15
    .mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),0.1)
    .color(1,-0.2,-0.2)
    .modulate(h.src(h.o0).rotate(({time}) => (time*0.1)%360), ({time}) => Math.sin(time*0.01)*0.01)
    .contrast(1.17)
    .saturate(1.03)
    .blend(h.src(h.s0).color(1,1.4,1).luma(0.5,v1), 0.25) //threshold: .luma(threshold, 0.3) discreet values: [1,0.5,0.01]
    .modulateHue(h.src(h.o0).modulate(h.noise(100),5),10) // granurality: .modulateHue(h.src(h.o0).modulate(h.noise(100),5),granularity) discret values: [10,100,1000]
    .out(h.o0);
  h.render(h.o0)
}

function patch2p1(h) {
  //Patch2+1
  h.src(h.o1)
    .modulate(h.osc(10,0,1.5).modulate(h.src(h.s0).sub(h.gradient()),1.5).brightness(-0.5),0.0015) //modulate amnt: 0.003, 0.001, 0.0015,0.002
    .blend(h.src(h.s0).hue(({time}) => Math.sin(time*0.001)).posterize(20,4).contrast(1.5),0.04) //blend amt: 0.01,0.04,0.001
    .modulatePixelate(h.voronoi(100,0.3,1000).pixelate(20,20),({time}) => 400+(250*(Math.sin(time*0.1))),8) //voronoi(100,0.3,1000).pixelate(20,20), voronoi(100,0.3,1).pixelate(20,2), voronoi(100,0.3,1).pixelate(2,20)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).colorama(0.1)).scale(1.01),20)
    .luma(0.1,0.1)
    .colorama(({time}) => 0.04+(0.03*(Math.sin(time*0.1)))) //0.1, 0.01-0.15
    .mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),0.1)
    .out(h.o1);
  
  h.render(h.o1);
}

function patch2p4(h) {
  //Patch2+4
  h.src(h.o1)
    .modulate(h.osc(10,0,1.5).modulate(h.src(h.s0).sub(h.gradient()),1.5).brightness(-0.5),0.0015) //modulate amnt: 0.003, 0.001, 0.0015,0.002
    .blend(h.src(h.s0).hue(({time}) => Math.sin(time*0.01)).posterize(20,4).contrast(1.5),0.2) //blend amt: 0.01,0.04,0.001
    .hue(({time}) => Math.sin(time*0.5)) // hue speed: Math.sin(time*speed), discret values :[1, 100]
    .modulate(h.src(h.s0),({time}) => 1+(0.5*Math.sin(time*0.01))) //speed: Math.sin(time*speed), discret values: [0.1, 1 ,50]
    .out(h.o1);
  
  h.render(h.o1);
}

function patch3p1(h) {
  //Patch3+1
  h.src(h.o2)
    .color(1,-0.2,-0.2)
    .modulate(h.src(h.o2).rotate(({time}) => (time*0.1)%360), ({time}) => Math.sin(time*0.01)*0.01)
    .contrast(1.17)
    .saturate(1.03)
    .blend(h.src(h.s0).color(1,1.4,1).luma(0.5,0.3), 0.25) //threshold: .luma(threshold, 0.3) discreet values: [1,0.5,0.01]
    .modulateHue(h.src(h.o2).modulate(h.noise(100),5),10) // granurality: .modulateHue(h.src(h.o0).modulate(h.noise(100),5),granularity) discret values: [10,100,1000]
    .modulatePixelate(h.voronoi(100,0.3,1000).pixelate(20,20),({time}) => 400+(250*(Math.sin(time*0.1))),8) //voronoi(100,0.3,1000).pixelate(20,20), voronoi(100,0.3,1).pixelate(20,2), voronoi(100,0.3,1).pixelate(2,20)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).colorama(0.1)).scale(1.01),20)
    .luma(0.1,0.1)
    .colorama(({time}) => 0.045+(0.035*(Math.sin(time*0.1)))) //0.1, 0.01-0.15
    .mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),0.1)
    .out(h.o2);
  
    h.render(h.o2);
}

function patch3p4(h) {
  //Patch3+4
  h.src(h.o2)
    .color(1,-0.2,-0.2)
    .modulate(h.src(h.o2).rotate(({time}) => (time*1)%360), ({time}) => Math.sin(time*0.01)*0.01)
    .contrast(1.1)
    .saturate(1)
    .blend(h.src(h.s0).color(1,1.4,1).luma(0.5,0.3), 1) //threshold: .luma(threshold, 0.3) discreet values: [1,0.05]
    .modulateHue(h.src(h.o2).modulate(h.noise(100),5),10) // granurality: .modulateHue(h.src(h.o0).modulate(h.noise(100),5),granularity) discret values: [10,100,1000]
    .hue(({time}) => Math.sin(time*0.1)) // hue speed: Math.sin(time*speed), discret values :[1, 100]
    //.posterize(20,4)
    .modulate(h.o2,({time}) => 1+(0.5*Math.sin(time*0.1))) //speed: Math.sin(time*speed), discret values: [0.1, 1 ,50]
    .out(h.o2);
  
  h.render(h.o2);
}

function patch4p1(h) {
  //Patch4+1
  h.src(h.s0)
    .hue(({time}) => Math.sin(time*0.25)) // hue speed: Math.sin(time*speed), discret values :[1, 100]
    .posterize(20,4)
    .modulate(h.o3,({time}) => 500+(0.5*Math.sin(time*0.1))) //speed: Math.sin(time*speed), discret values: [0.1, 1 ,50]
    .modulatePixelate(h.voronoi(100,0.3,1000).pixelate(20,20),({time}) => 400+(250*(Math.sin(time*0.1))),8) //voronoi(100,0.3,1000).pixelate(20,20), voronoi(100,0.3,1).pixelate(20,2), voronoi(100,0.3,1).pixelate(2,20)
    .diff(h.src(h.s0).modulateHue(h.src(h.o3).colorama(0.1)).scale(1.01),20)
    .luma(0.1,0.1)
    .colorama(({time}) => 0.045+(0.035*(Math.sin(time*0.05)))) //0.1, 0.01-0.15
    .mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),0.1)
    .out(h.o3);
  
  h.render(h.o3);
}

function patch4p2(h) {
  //Patch4+2
  h.src(h.s0)
    .hue(({time}) => Math.sin(time*100)) // hue speed: Math.sin(time*speed), discret values :[1, 100]
    .posterize(20,4)
    .modulate(h.o3,({time}) => 500+(0.5*Math.sin(time*0.1))) //speed: Math.sin(time*speed), discret values: [0.1, 1 ,50]
    .modulate(h.osc(10,0,1.5).modulate(h.src(h.s0).sub(h.gradient()),1.5).brightness(-0.5),0.0015) //modulate amnt: 0.003, 0.001, 0.0015,0.002
    .blend(h.src(h.s0).hue(({time}) => Math.sin(time*0.1)).posterize(20,4).contrast(1.5),0.4) //blend amt: 0.01,0.04,0.001
    .out(h.o3);
    
  h.render(h.o3);
}

function patch4p3(h) {
  //Patch4+3
  h.src(h.s0)
    .hue(({time}) => Math.sin(time*1)) // hue speed: Math.sin(time*speed), discret values :[1, 100]
    .posterize(20,4)
    .modulate(h.o3,({time}) => 500+(0.5*Math.sin(time*0.1))) //speed: Math.sin(time*speed), discret values: [0.1, 1 ,50]
    .color(1,-0.2,-0.2)
    .modulate(h.src(h.o2).rotate(({time}) => (time*0.1)%360), ({time}) => Math.sin(time*0.01)*0.01)
    .contrast(1.17)
    .saturate(1.03)
    .blend(h.src(h.s0).color(1,1.4,1).luma(0.5,0.3), 0.25) //threshold: .luma(threshold, 0.3) discreet values: [1,0.5,0.01]
    .modulateHue(h.src(h.o3).modulate(h.noise(100),5),10) // granurality: .modulateHue(h.src(h.o0).modulate(h.noise(100),5),granularity) discret values: [10,100,1000]
    .out(h.o3);
  
  h.render(h.o3);
}

function patch5p1(h) {
  //Patch5+1
  h.src(h.s0)
    .modulate(h.voronoi(({time}) => 100+(100*Math.sin(time*0.1)).mult(h.osc(10,0.1,0.5)), 1, 1))
    .mult(h.o0, 0.1)
    .scale(0.5)
    .color(({time}) => 1*(Math.sin(time*0.21)), ({time}) => 0.25*(Math.sin(time*0.2)),1)
    .color(1, 1.1,1)
    .contrast(1.5)
    .modulate(h.o0, 0.5)
    .saturate(1.5)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).scale(1.01),1)
    .layer(h.osc(1,0.5,10).mask(h.shape(4,1,0.001).diff(h.src(h.s0,0.5).repeat(4)))),0.5)
    .modulatePixelate(h.voronoi(100,0.3,1000).pixelate(20,20),({time}) => 400+(250*(Math.sin(time*0.1))),8) //voronoi(100,0.3,1000).pixelate(20,20), voronoi(100,0.3,1).pixelate(20,2), voronoi(100,0.3,1).pixelate(2,20)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).colorama(0.1)).scale(1.01),20)
    .luma(0.1,0.1)
    .colorama(({time}) => 0.045+(0.035*(Math.sin(time*1)))) //0.1, 0.01-0.15
    .mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),0.1)
    .out(h.o0);
  
  h.render(h.o0);
}

function patch5p3(h) {
  //Patch 5+3
  h.src(h.s0)
    .modulate(h.voronoi(({time}) => 100+(100*Math.sin(time*0.1)).mult(h.osc(10,0.1,0.5)), 1, 1))
    .mult(h.o0, 0.1)
    .scale(0.5)
    .color(({time}) => 1*(Math.sin(time*0.21)), ({time}) => 0.25*(Math.sin(time*0.2)),1)
    .color(1, 1.1,1)
    .contrast(1.5)
    .modulate(h.o0, 0.5)
    .saturate(1.5)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).scale(1.01),1)
    .layer(h.osc(1,0.5,10).mask(h.shape(4,1,0.001).diff(h.src(h.s0,0.5).repeat(4)))),0.5)
    .color(1,-0.2,-0.2)
    .modulate(h.src(h.o0).rotate(({time}) => (time*0.1)%360), ({time}) => Math.sin(time*0.01)*0.01)
    .contrast(1.17)
    .saturate(1.03)
    .blend(h.src(h.s0).color(1,1.4,1).luma(0.5,0.3), 0.25) //threshold: .luma(threshold, 0.3) discreet values: [1,0.5,0.01]
    .modulateHue(h.src(h.o0).modulate(h.noise(100),5),10) // granurality: .modulateHue(h.src(h.o0).modulate(h.noise(100),5),granularity) discret values: [10,100,1000]
    .out(h.o0);

  h.render(h.o0);
}

const patchList = [
  patch1,
  patch2,
  patch3,
  patch4,
  patch5,
  // patch1p3,
  // patch2p1,
  // patch2p4,
  // patch3p1,
  // patch3p4,
  // patch4p1,
  // patch4p2,
  // patch4p3,
  // patch5p1,
  // patch5p3
];

export default patchList;