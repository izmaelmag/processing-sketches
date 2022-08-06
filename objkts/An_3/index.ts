import P5 from "p5";
import { Recorder, Colors, toRad, polyPoints } from "../../shared";
import { Line } from "../../shared/Line";
import Polygon from "../../shared/Polygon";
import SimplexNoise from "simplex-noise";
import { colord } from "colord";

const Noise = new SimplexNoise();

const size = 360;
const time = 5;

let center = { x: size / 2, y: size / 2 };
let vertices = 4;
let square: Polygon = new Polygon(
  center,
  200,
  vertices,
  Math.PI / vertices + Math.PI / 2
);
let squareLines: Line[];
let squarePerimeterPoints: Point[] = [];
let squareGraphics: P5.Graphics;
let circleGraphics: P5.Graphics;
let circlePoints = polyPoints({ center, radius: 150 }, 30);

const getSquareImage = (angle: number) => {
  squareGraphics.background(255);
  squareGraphics.fill(Colors.yellow);
  squareGraphics.noStroke();

  circlePoints.forEach(({ x, y }) => {
    let xNoise = Noise.noise4D(
      x * 0.01,
      y * 0.01,
      0.2 * Math.cos(toRad(angle)),
      0.2 * Math.sin(toRad(angle))
    );
    let yNoise = Noise.noise4D(
      x * 0.01,
      y * 0.01,
      -200 + 0.2 * Math.cos(toRad(angle)),
      -200 + 0.2 * Math.sin(toRad(angle))
    );
    squareGraphics.circle(x + xNoise * 6, y + yNoise * 10, 20);
  });
};

const getCircleImage = (angle: number) => {
  circleGraphics.background(255);
  circleGraphics.noStroke();
  circleGraphics.fill(Colors.blue);
  circleGraphics.beginShape();

  squarePerimeterPoints.forEach(({ x, y }) => {
    let xNoise = Noise.noise4D(
      x * 0.005,
      y * 0.005,
      400 + 0.5 * Math.cos(toRad(angle + Math.PI)),
      400 + 0.5 * Math.sin(toRad(angle + Math.PI))
    );

    let yNoise = Noise.noise4D(
      x * 0.005,
      y * 0.005,
      0.5 * Math.cos(toRad(angle + Math.PI)),
      0.5 * Math.sin(toRad(angle + Math.PI))
    );
    circleGraphics.vertex(x + xNoise * 10, y + yNoise * 10);
  });
  circleGraphics.endShape();
};

new Recorder({
  size: {
    width: size,
    height: size,
  },
  time,
  onSetup: (p: P5) => {
    squareGraphics = p.createGraphics(size, size);
    squareGraphics.background(255);

    circleGraphics = p.createGraphics(size, size);
    circleGraphics.background("#fff");

    squareLines = square.getLines();

    for (let ln = 0; ln < squareLines.length; ln++) {
      let points = squareLines[ln].getPoints(10);
      squarePerimeterPoints = squarePerimeterPoints.concat(
        ln === squareLines.length - 1 ? points.reverse() : points
      );
    }
  },
  onDraw: (p: P5, progress: number = 0) => {
    let angle = 360 * progress;

    getSquareImage(angle);
    getCircleImage(angle);

    p.imageMode(p.CENTER);
    p.image(squareGraphics, size / 2, size / 2, size, size);
    p.image(circleGraphics, size / 2, size / 2, 180, 180);
  },
});
