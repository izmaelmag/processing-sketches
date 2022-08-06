import P5 from "p5";
import { Recorder, Colors, toRad, polyPoints, sine } from "../../shared";
import { Line } from "../../shared/Line";
import Polygon from "../../shared/Polygon";
import SimplexNoise from "simplex-noise";
import { colord } from "colord";
import * as dat from "dat.gui";

const Noise = new SimplexNoise();

enum shapes {
  circle = "circle",
  square = "square",
}

const params = {
  circles: 42,
  circlesGap: 12,
  pointsIncrement: 2,
  maxWeight: 30,
  minWeight: 5,
  rotation: 1,
  shape: shapes.circle,
  phaseOffset: 0.05,
  backgroundColor: "#000000",
  firstColor: "#ffffff",
  secondColor: "#ff00ff",
};

const gui = new dat.GUI({
  name: "Params",
});

gui.add(params, "circles", 1, 50, 1);
gui.add(params, "circlesGap", 1, 100, 1);
gui.add(params, "pointsIncrement", 1, 10, 1);
gui.add(params, "phaseOffset", 0, 1, 0.01);
gui.add(params, "rotation", -1, 1, 1);
gui.add(params, "minWeight", 0, 10, 0.1);
gui.add(params, "maxWeight", params.minWeight, 50, 0.1);
gui.add(params, "shape", [shapes.circle, shapes.square]);
gui.addColor(params, "backgroundColor");
gui.addColor(params, "firstColor");
gui.addColor(params, "secondColor");

const size = 640;
const time = 5;

let center = size / 2;

new Recorder({
  size: {
    width: size,
    height: size,
  },
  time,
  onSetup: (p: P5) => {
    p.background(255);
    p.noStroke();
  },
  onDraw: (p: P5, progress: number = 0) => {
    gui.remember(params)
    p.background(params.backgroundColor);

    for (let i = 1; i <= params.circles; i++) {
      p.fill(i % 2 ? params.firstColor : params.secondColor);

      let radius = params.circlesGap * i;
      let verticesCount = i * params.pointsIncrement;
      let circlePhase = p.map(i, 0, params.circles, 0, params.phaseOffset);
      let angleDiff = p.TWO_PI / verticesCount;

      let circleProgress = (progress + circlePhase * i) % 1;

      let weightSine = sine({
        min: params.minWeight,
        max: params.maxWeight,
        angle: circleProgress * 360,
      });

      let radiusSine = sine({
        min: radius - 10,
        max: radius + 10,
        angle: circleProgress * 360,
      });

      let circleCenter = {
        center: { x: center, y: center },
        radius: radiusSine,
      };

      let pointsAngle =
        Math.PI / 6 + Math.PI / 2 + angleDiff * 5 * progress * params.rotation;
      let circlePoints = polyPoints(circleCenter, verticesCount, pointsAngle);

      for (let n = 0; n < circlePoints.length; n++) {
        const { x, y } = circlePoints[n];

        if (params.shape === shapes.circle) {
          p.circle(x, y, weightSine);
        }

        if (params.shape === shapes.square) {
          p.rectMode(p.CENTER);
          p.rect(x, y, weightSine, weightSine);
        }
      }
    }
  },
});
