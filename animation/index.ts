import P5 from "p5";
import Stats from "stats.js";
import * as dat from "dat.gui";

const params = {
  size: 520,
  debug: true,
  mouse: { x: 0, y: 0 },
  dt: 0,
};

const sketch = (p: P5) => {
  const stats = new Stats();
  const gui = new dat.GUI({ name: "Params", });

  // Before sketch start
  p.preload = () => {
    gui.add(params, "debug");
  };

  p.setup = () => {
    p.createCanvas(params.size, params.size);

    if (params.debug) {
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
    }
  };

  p.draw = () => {
    params.debug && stats.begin();

    // Increase counter
    params.dt += p.deltaTime;

    // Global mouse position
    params.mouse = {
      x: p.mouseX,
      y: p.mouseY,
    };

    params.debug && stats.end();
  };
};

new P5(sketch);
