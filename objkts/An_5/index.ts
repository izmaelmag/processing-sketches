import P5 from "p5";
import { Recorder, Colors, toRad, polyPoints, sine } from "../../shared";
import { Line } from "../../shared/Line";
import Polygon from "../../shared/Polygon";
import SimplexNoise from "simplex-noise";
import { colord } from "colord";
import * as dat from "dat.gui";

const Noise = new SimplexNoise();

const width = 480;
const height = 480;
const time = 3;

const params = {
  pointsOnLine: 2,
  lines: 30,
  maxWidth: 30,
};

new Recorder({
  size: { width, height },
  time,
  onSetup: (p: P5) => {
    p.background(255);
    p.noFill();

    let gui = new dat.GUI({
      name: "Params",
    });

    gui.add(params, "lines", 3, 40, 1);
    gui.add(params, "maxWidth", 10, 80, 1);
  },
  onDraw: (p: P5, progress: number = 0) => {
    p.background(255);

    let yGap = height / params.lines;
    let xGap = width / params.pointsOnLine;
    let yOffset = p.map(progress, 0, 1, 0, yGap);

    for (let lineN = 0; lineN <= params.lines; lineN++) {
      let y = lineN * yGap;

      p.beginShape();
      p.stroke(Colors.yellow);
      p.strokeWeight(p.map(y + yOffset, 0, height, 0, params.maxWidth));
      for (let pointN = 0; pointN <= params.pointsOnLine; pointN++) {
        let x = pointN * xGap;

        p.vertex(x, y + yOffset + height/2);
      }
      p.endShape();

      p.beginShape();
      p.stroke(Colors.blue);
      p.strokeWeight(p.map(y - yOffset, height, 0, 0, params.maxWidth));
      for (let pointN = 0; pointN <= params.pointsOnLine; pointN++) {
        let x = pointN * xGap;

        p.vertex(x, y - yOffset - height/2);
      }
      p.endShape();
    }
  },
});
