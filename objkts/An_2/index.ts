import P5 from "p5";
import { Recorder, Colors, toRad, sine, easeInOutCubic } from "../../shared";
import SimplexNoise from "simplex-noise";
import { colord } from "colord";
import * as dat from "dat.gui";

const Noise = new SimplexNoise();

const size = 520;
const time = 8;

const params = {
  details: 1,
  lines: 14,
  zRadius: 0.3,
  xZoom: 0.02,
  ySpread: 8,
  amp: 41,
  xAmp: 13,
  zPhase: 0.4,
  c: size / 2,
  strokeSize: 2,
  kFade: 0,
  line: true,
  edgeShrink: true,
};

const gui = new dat.GUI({
  name: "Params",
});

gui.add(params, "lines", 1, 40);
gui.add(params, "zRadius", 0, 0.5, 0.01);
gui.add(params, "xZoom", 0, 0.02, 0.0005);
gui.add(params, "ySpread", -20, 20, 1);
gui.add(params, "amp", 0, 200, 1);
gui.add(params, "xAmp", 0, 50, 1);
gui.add(params, "zPhase", 0, 1, 0.01);
gui.add(params, "kFade", 0, 1, 0.01);
gui.add(params, "strokeSize", 1, 10, 1);
gui.add(params, "details", 1, 20, 0.5);
gui.add(params, "line");
gui.add(params, "edgeShrink");

new Recorder({
  size: {
    width: size,
    height: size,
  },
  time,
  onDraw: (p: P5, progress: number = 0) => {
    const {
      details,
      lines,
      zRadius,
      xZoom,
      ySpread,
      amp,
      xAmp,
      zPhase,
      c,
      strokeSize,
      kFade,
      line,
      edgeShrink,
    } = params;

    let angle = 360 * progress;

    p.background(255)

    p.strokeWeight(strokeSize);
    p.noFill();

    for (let n = 0; n <= lines; n++) {
      // Define colors
      let yellowColor = colord(Colors.yellow)
        .alpha(n / lines + (1 - kFade))
        .toRgbString();

      let blueColor = colord(Colors.blue)
        .alpha(n / lines)
        .toRgbString();

      p.beginShape();
      p.stroke(yellowColor);
      for (let x = -xAmp; x <= size + xAmp; x += details) {
        let intense = edgeShrink ? Math.sin(p.map(x, 0, size, 0, p.PI)) : 1;

        let ypos = c - n * (ySpread / 2) * intense;

        let za = toRad(angle + n * lines * zPhase);

        let noiseValue = Noise.noise4D(
          xZoom * x,
          c,
          zRadius * Math.sin(za),
          zRadius * Math.cos(za)
        );

        let xNoiseValue = Noise.noise4D(
          xZoom * x,
          c,
          200 + zRadius * Math.sin(za),
          200 + zRadius * Math.cos(za)
        );

        let yOff = intense * noiseValue * amp * 0.5;
        let y = ypos + yOff + amp * 0.75;
        let xPos = x + (n % 2 ? details / 2 : 0) + xNoiseValue * xAmp;

        if (line) {
          p.vertex(xPos, y);
        } else {
          p.circle(xPos, y, strokeSize);
        }
      }
      p.endShape();

      p.beginShape();
      p.stroke(blueColor);
      for (let x = -xAmp; x <= size + xAmp; x += details) {
        let intense = edgeShrink ? Math.sin(p.map(x, 0, size, 0, p.PI)) : 1;

        let ypos = c - n * ySpread * intense;

        let za = toRad(angle + n * lines * zPhase);

        let noiseValue = Noise.noise4D(
          xZoom * x,
          c + 100,
          zRadius * Math.sin(za),
          zRadius * Math.cos(za)
        );

        let xNoiseValue = Noise.noise4D(
          xZoom * x,
          c + 4000,
          200 + zRadius * Math.sin(za),
          200 + zRadius * Math.cos(za)
        );

        let yOff = intense * noiseValue * amp;
        let y = ypos + yOff - amp * 0.5;
        let xPos = x + (n % 2 ? details / 2 : 0) + xNoiseValue * xAmp;

        if (line) {
          p.vertex(xPos, y);
        } else {
          p.circle(xPos, y, strokeSize);
        }
      }
      p.endShape();
    }
  },
});
