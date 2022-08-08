import P5 from "p5";
import Stats from "stats.js";
import * as dat from "dat.gui";
import { createNoise4D } from "simplex-noise";

const params = {
  size: 512,
  background: 255,
  debug: true,
  n: 60,
  noiseScale: 0.05,
  cellSize: 0,
};

const sketch = (p: P5) => {
  const colorPalette = ["#ddfd0d", "#ff5b0f", "#ff0099", "#0084ff", "#6f00e6"];
  const stats = new Stats();
  const gui = new dat.GUI({ name: "Params" });

  let dt = 0;
  const noise = createNoise4D();

  const fullSquare = (x: number, y: number) => {
    p.rectMode(p.CENTER);
    p.rect(x, y, params.cellSize, params.cellSize);
  };

  const halfSquare = (x: number, y: number) => {
    p.rectMode(p.CENTER);
    p.rect(x, y, params.cellSize / 2, params.cellSize / 2);
  };

  const quarterSquare = (x: number, y: number) => {
    p.rectMode(p.CENTER);
    p.rect(x, y, params.cellSize / 4, params.cellSize / 4);
  };

  const shapeRenderers = [fullSquare, fullSquare, halfSquare, quarterSquare];

  // Before sketch start
  p.preload = () => {
    gui.add(params, "debug");
    gui.add(params, "n", 4, params.size/6).step(1);
    gui.add(params, "noiseScale", 0, 1).step(0.001);
  };

  p.setup = () => {
    p.createCanvas(params.size, params.size);

    if (params.debug) {
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
    }

    p.noStroke();
  };

  p.draw = () => {
    params.cellSize = Math.ceil(params.size / params.n);

    params.debug && stats.begin();

    p.background(255);

    const R = p.dist(0, 0, p.width, p.height)/2;

    for (let i = 0; i < params.n; i++) {
      for (let j = 0; j < params.n; j++) {
        const x = params.cellSize / 2 + params.cellSize * i;
        const y = params.cellSize / 2 + params.cellSize * j;

        let colorNoise = noise(
          i * params.noiseScale,
          j * params.noiseScale + dt / 5000,
          dt / 5000,
          0
        );

        // Distance to CENTER
        const d = p.dist(x + p.sin(dt/1000) * 100, y + p.cos(dt/1000) * 1000, p.width / 2, p.height);

        let colorIndex = Math.ceil(
          p.map(colorNoise, -1, 1, 0, colorPalette.length - 1)
        );

        let shapeIndex = Math.ceil(p.map(Math.sin((dt - d*10*y/R)/1000), -1, 1, 0, shapeRenderers.length - 1));

        p.fill(colorPalette[colorIndex]);

        shapeRenderers[shapeIndex](x, y);
      }
    }

    // Increase counter
    dt += p.deltaTime;

    params.debug && stats.end();
  };
};

new P5(sketch);
