// function runMixer(h) {
// s0.initVideo('https://rr4---sn-5ualdnlr.googlevideo.com/videoplayback?expire=1649014329&ei=2aFJYtOvK5DP8wT__oKwDQ&ip=2601%3A5c2%3A100%3A3f30%3A6d31%3A60e4%3Affa3%3Ac71c&id=o-AC3QtO0OklMrw6vNMVgetnwPp3k4j3wSPglUpb4Hh6Lp&itag=22&source=youtube&requiressl=yes&mh=Me&mm=31%2C26&mn=sn-5ualdnlr%2Csn-p5qlsndk&ms=au%2Conr&mv=m&mvi=4&pl=50&initcwndbps=1636250&spc=4ocVC1lvPxQkC0YzL7XluwUvCCTG&vprv=1&mime=video%2Fmp4&ns=e61KbWgfwpv6qCue3E-MjQEG&cnr=14&ratebypass=yes&dur=1709.476&lmt=1648780718421022&mt=1648992295&fvip=3&fexp=24001373%2C24007246&c=WEB&txp=5432434&n=ecQIiggNH6NgVm3qO&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAMam4cTKhZ9-PJ9eOF6oVzpoi4sRxRN6s8Vz7COzSTKiAiEA1kt3FWHxsWm6A_PGupeBVFwg_xIkUB9-vyKQQXncl78%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAMTiawx4XbRtXVTkmC10bn2Q8xGfbraozRgx58hg7TkWAiEAzS91rbozxNg4xCOhu4JSmh8qGvLvKGFfT7mkp5bq_MM%3D')

// render()

// render(h.o0) //Channel 1

// render(h.o1) //Channel 2

// render(h.o2) //Channel 3

// render(h.o3) //Channel 4

//src(h.o0).modulate(h.o3).out(h.o3)

//Patch1
function patch1(h) {
  h.src(h.s0)
    .modulatePixelate(h.voronoi(100,0.3,1000).pixelate(20,20),({time}) => 400+(250*(Math.sin(time*0.1))),8) //voronoi(100,0.3,1000).pixelate(20,20), voronoi(100,0.3,1).pixelate(20,2), voronoi(100,0.3,1).pixelate(2,20)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).colorama(0.1)).scale(1.01),20)
    .luma(0.1,0.1)
    .colorama(({time}) => 0.085+(0.075*(Math.sin(time*0.5)))) //0.1, 0.01-0.15
    .mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),0.1)
    .out(h.o0)
  h.render(h.o0)
}

function patch2(h) {
  //Patch2
  h.src(h.o1)
    .modulate(h.osc(10,0,1.5).modulate(h.src(h.s0).sub(h.gradient()),1.5).brightness(-0.5),0.0015) //modulate amnt: 0.003, 0.001, 0.0015,0.002
    .blend(h.src(h.s0).hue(({time}) => Math.sin(time*0.001)).posterize(20,4).contrast(1.5),0.04) //blend amt: 0.01,0.04,0.001
    .out(h.o1)
  h.render(h.o1)
}

function patch3(h) {
  //Patch3
  h.src(h.o2)
    .color(1,-0.2,-0.2)
    .modulate(h.src(h.o2).rotate(({time}) => (time*0.1)%360), ({time}) => Math.sin(time*0.01)*0.01)
    .contrast(1.17)
    .saturate(1.03)
    .blend(h.src(h.s0).color(1,1.4,1).luma(0.5,0.3), 0.25) //threshold: .luma(threshold, 0.3) discreet values: [1,0.5,0.01]
    .modulateHue(h.src(h.o2).modulate(h.noise(100),5),10) // granurality: .modulateHue(h.src(h.o0).modulate(h.noise(100),5),granularity) discret values: [10,100,1000]
    .out(h.o2);
  h.render(h.o2)
}

function patch4(h) {
  //Patch4
  h.src(h.s0)
    .hue(({time}) => Math.sin(time*1)) // hue speed: Math.sin(time*speed), discret values :[1, 100]
    .posterize(20,4)
    .modulate(h.o3,({time}) => 500+(0.5*Math.sin(time*0.1))) //speed: Math.sin(time*speed), discret values: [0.1, 1 ,50]
    .out(h.o3)
  h.render(h.o3)
}

function patch5(h) {
  //Patch5
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
    .out(h.o0);
  h.render(h.o0)
}

function patch1p3(h) {
  //Patch1+3
  h.src(h.s0)
    .modulatePixelate(h.voronoi(100,0.3,1000).pixelate(20,20),({time}) => 400+(250*(Math.sin(time*0.1))),8) //h.voronoi(100,0.3,1000).pixelate(20,20), h.voronoi(100,0.3,1).pixelate(20,2), voronoi(100,0.3,1).pixelate(2,20)
    .diff(h.src(h.s0).modulateHue(h.src(h.o0).colorama(0.1)).scale(1.01),20)
    .luma(0.1,0.1)
    .colorama(({time}) => 0.75+(0.75*(Math.sin(time*0.1)))) //0.1, 0.01-0.15
    .mult(h.src(h.s0).modulateHue(h.osc(1,1,0.5).scale(1.01),1),0.1)
    .color(1,-0.2,-0.2)
    .modulate(h.src(h.o0).rotate(({time}) => (time*0.1)%360), ({time}) => Math.sin(time*0.01)*0.01)
    .contrast(1.17)
    .saturate(1.03)
    .blend(h.src(h.s0).color(1,1.4,1).luma(0.5,0.3), 0.25) //threshold: .luma(threshold, 0.3) discreet values: [1,0.5,0.01]
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
  patch1p3,
  patch2p1,
  patch2p4,
  patch3p1,
  patch3p4,
  patch4p1,
  patch4p2,
  patch4p3,
  patch5p1,
  patch5p3
];

export default patchList;