import P5, { Graphics } from "p5";
import Stats from "stats.js";
import { createNoise3D } from "simplex-noise";

const params = {
  size: 640,
  debug: true,
  scaleFactor: 10,
};

let dt = 0;

class Figure {
  brightness: number;

  f1: Point;
  f2: Point;
  f3: Point;
  c1: Point;
  c2: Point;
  t: Point;

  yOffset: number = 0;

  constructor(brightness: number) {
    this.brightness = brightness;
    this.getFloorPoints();
  }

  getFloorPoints() {
    let size = params.size / params.scaleFactor;

    this.f1 = {
      x: (Math.random() * size) / 2,
      y: size,
    };

    this.f2 = {
      x: size / 2 + (Math.random() * size) / 2,
      y: size,
    };

    this.t = {
      x:
        40 / params.scaleFactor +
        this.f1.x +
        Math.random() * (this.f2.x - this.f1.x - 80 / params.scaleFactor),
      y: (Math.random() * size) / 40 * params.scaleFactor,
    };

    this.c1 = {
      x: this.f1.x + Math.random() * (this.t.x - this.f1.x) - 10 / params.scaleFactor,
      y: 2 + this.t.y + (Math.random() * size) / 5,
    };

    this.c2 = {
      x:
        this.t.x +
        (this.f2.x - this.t.x) / 4 +
        Math.random() * ((this.f2.x - this.t.x) * 0.75),
      y: this.c1.y,
    };

    this.f3 = {
      x: this.t.x + (Math.random() * 2 - 1) * 2,
      y: size,
    };
  }

  draw(p: P5) {
    p.fill(250 - (125 + Math.sin(dt / 1000) * 125));
    p.noStroke();
    p.beginShape();
    p.vertex(this.f1.x, this.f1.y);
    p.vertex(this.f3.x, this.f3.y);
    p.vertex(this.t.x, this.t.y);
    p.vertex(this.c1.x, this.c1.y);
    p.endShape(p.CLOSE);
    
    p.fill(280 - (125 + Math.sin(dt / 1000) * 125));
    p.beginShape();
    p.vertex(this.f2.x, this.f2.y);
    p.vertex(this.f3.x, this.f3.y);
    p.vertex(this.t.x, this.t.y);
    p.vertex(this.c2.x, this.c2.y);
    p.endShape(p.CLOSE);
  }
}

const sketch = (p: P5) => {
  const stats = new Stats();

  let graphics: Graphics = null;
  let figure: Figure = null;
  let noise = createNoise3D();

  p.setup = () => {
    graphics = p.createGraphics(params.size / params.scaleFactor, params.size / params.scaleFactor);

    p.createCanvas(params.size, params.size);
    p.noStroke();

    // FPS graph gui
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    figure = new Figure(0);

    figure.draw(graphics);

    p.frameRate(20);
  };

  p.draw = () => {
    stats.begin();
    p.background(255);

    dt += p.deltaTime;

    p.noSmooth();

    figure = new Figure(0);

    graphics.background(125 + Math.sin(dt / 1000) * 125, 10);
    figure.draw(graphics);

    for (let x = 0; x < graphics.width; x += 1) {
      for (let y = 0; y < graphics.height; y += 1) {
        let n = noise(x/10, (y+y)/10 + dt/1000, dt / 1000);
        let brightness = p.map(n, -1, 1, 125, 255);
        p.noStroke()
        graphics.fill(brightness, brightness, brightness, 5);
        graphics.rect(x, y, 1, 1);
      }
    }

    p.image(graphics, 0, 0, params.size, params.size);

    stats.end();
  };
};

new P5(sketch);
