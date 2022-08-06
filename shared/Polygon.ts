import { Line } from "./Line";
import { polyPoints } from ".";

class Polygon {
  center: Point;
  radius: number;
  vertices: number;
  rotation: number;

  constructor(
    center: Point,
    radius: number,
    vertices: number,
    rotation: number = 0
  ) {
    this.center = center;
    this.radius = radius;
    this.vertices = vertices;
    this.rotation = rotation;
  }

  getLines(): Line[] {
    let points = this.getVertices();
    let lines = new Array<Line>(points.length);
    let lastIndex = points.length - 1;

    for (let i = 0; i < lastIndex; i++) {
      lines[i] = new Line(points[i], points[i + 1]);
    }

    lines[lastIndex] = new Line(points[0], points[lastIndex]);

    return lines;
  }

  getVertices(): Point[] {
    return polyPoints(
      {
        center: this.center,
        radius: this.radius,
      },
      this.vertices,
      this.rotation
    );
  }
}

export default Polygon;
