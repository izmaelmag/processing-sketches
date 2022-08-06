import P5 from "p5";
import { Recorder, Colors, toRad, sine, easeInOutCubic } from "../../shared";
import * as dat from "dat.gui";
import { Line } from "../../shared/Line";

const params = {
  count: 10,
  percent: 50,
};

const gui = new dat.GUI({
  name: "Params",
});

gui.add(params, "percent", 0, 100);

const size = 520;
const time = 5;

const P2: Point = {
  x: size,
  y: 0,
};

const P1: Point = {
  x: 0,
  y: size,
};

const line = new Line(P1, P2);

new Recorder({
  size: {
    width: size,
    height: size,
  },
  time,
  onSetup: (p: P5) => {
    p.noStroke();
  },
  onDraw: (p: P5, progress: number = 0) => {
    let count = p.map(Math.sin(progress * p.TWO_PI), -1, 1, 0, 1) * 20;

    let linePoints: Point[] = line.getPoints(Math.round(count));

    p.background(255);

    for (let i = 0; i < linePoints.length; i++) {
      const { x, y } = linePoints[i];

      p.fill(255, 0, 0);
      p.circle(x, y, 10);
    }
  },
});
