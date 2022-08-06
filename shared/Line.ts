export class Line {
  public p1: Point;
  public p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  set start(p: Point) {
    this.p1 = p;
  }

  set end(p: Point) {
    this.p2 = p;
  }

  get dy() {
    return this.p2.y - this.p1.y
  }

  get dx() {
    return this.p2.x - this.p1.x
  }

  get slope() {
    return this.dy/this.dx
  }

  public pointAtDistance(percentage: number): Point {
    let { p1, slope, dx, dy } = this;

    let y = slope === 0 ? 0 : dy * percentage;
    let x = slope === 0 ? dx * percentage : y / slope;

    return {
      x: x + p1.x,
      y: y + p1.y,
    };
  }

  public getPoints(N: number): Point[] {
    let points = new Array<Point>(--N);
    points[N] = this.p2;

    for (let i = 0; i < N; i++) {
      points[i] = this.pointAtDistance(i / N);
    }

    return points;
  }
}
