import P5 from "p5";
import { Recorder, pointAtAngle, Colors } from "../../shared";

enum modes {
  square = "square",
  circle = "circle",
}

const params = {
  circleR: 200,
  squareW: 180,
  pointsCount: 100,
};

const size: number = 520;
const time: number = 6;
let points: Point[] = [];
let mode = modes.circle;
let angleStart = 0;

let circle = {
  center: {
    x: size / 2,
    y: size / 2,
  },
  radius: params.circleR,
};

let angleStep = 360 / params.pointsCount;

new Recorder({
  size: {
    width: size,
    height: size,
  },
  time,
  onSetup: (p: P5) => {
    p.noStroke();
    p.fill(Colors.yellow);

    for (let n = 0; n < params.pointsCount; n++) {
      points.push(pointAtAngle(circle, angleStart + n * angleStep));
    }

    p.mouseClicked = () => {
      if (mode === modes.square) {
        return (mode = modes.circle);
      }

      mode = modes.square;
    };
  },
  onDraw: (p: P5, progress: number = 0) => {
    let angle = 360 * progress;

    p.background(255);

    for (let i = 0; i < points.length; i++) {
      let point = pointAtAngle(circle, angleStart + i * angleStep);

      let x =
        mode === modes.circle
          ? point.x
          : p.constrain(
              point.x,
              size / 2 - params.squareW,
              size / 2 + params.squareW
            );

      let y =
        mode === modes.circle
          ? point.y
          : p.constrain(
              point.y,
              size / 2 - params.squareW,
              size / 2 + params.squareW
            );

      p.circle(x, y, 10);

      angleStart += 0.001;
    }
  },
});
