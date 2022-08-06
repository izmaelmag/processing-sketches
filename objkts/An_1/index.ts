import P5 from "p5";
import { sine, Colors, polyPoints } from "../../shared";

const sketch = (p: P5) => {
  let size = 520;
  let center = size / 2;

  // Recorder
  let currentFrame: number = 0;
  let progress: number = 0;
  let recording: boolean = false;

  // Loop options
  const fps = 60;
  const recfps = 5;
  const time = 5;
  const cycles = 1;
  const totalFrames = fps * time * cycles;

  // p.mouseClicked = () => {
  //   p.noLoop();
  //   p.frameRate(recfps);

  //   window.setTimeout(() => {
  //     recording = true;
  //     currentFrame = 0;
  //     progress = 0;
  //     p.loop();
  //   }, 1000);
  // };

  p.setup = () => {
    // Create P5 canvas renderer
    p.createCanvas(size, size);
    p.pixelDensity(2);
    p.frameRate(fps);
  };

  p.draw = () => {
    p.noStroke();
    p.background(255);

    // Debug data
    if (!recording) {
      p.fill(70);
      p.text(`Current frame: ${currentFrame} / ${totalFrames}`, 10, 20);
      p.text(`Progress: ${((progress / cycles) * 100).toFixed()}%`, 10, 40);
      p.text(`Cycles: ${cycles}`, 10, 60);
      p.text(recording ? "REC" : "Playing", 10, 80);
    }

    // Animation cycle
    let currentAngle = 360 * -progress;

    // First circle
    let vertCount1 = p.constrain(
      sine({ min: 0, max: 8, angle: currentAngle }),
      1,
      8
    );
    let radius1 = sine({ min: 50, max: 150, angle: currentAngle / 2 });
    let startAngle1 = sine({
      min: 0,
      max: p.TWO_PI * 2,
      angle: currentAngle,
    });
    let points1 = polyPoints(
      { center: { x: center, y: center }, radius: radius1 },
      vertCount1,
      startAngle1
    );

    p.fill(Colors.yellow);
    p.stroke(Colors.yellow);

    p.beginShape();
    points1.forEach(({ x, y }) => {
      p.circle(x, y, 60 - 6 * vertCount1);
      p.vertex(x, y);
    });
    p.noFill();
    p.strokeWeight(4);
    p.endShape(p.CLOSE);

    // Second circle
    let vertCount2 = p.constrain(
      sine({ min: 0, max: 12, angle: currentAngle }),
      1,
      12
    );
    let radius2 = sine({
      min: -100,
      max: 100,
      angle: currentAngle / 2,
      phase: 1,
    });
    let startAngle2 = sine({
      min: 0,
      max: p.TWO_PI * 2,
      angle: currentAngle / 2,
    });

    let points2 = polyPoints(
      { center: { x: center, y: center }, radius: radius2 },
      vertCount2,
      startAngle2
    );

    p.fill(Colors.blue);
    p.stroke(Colors.blue);

    p.beginShape();
    points2.forEach(({ x, y }) => {
      p.circle(x, y, 40 - 2 * vertCount2);
      p.vertex(x, y);
    });
    p.noFill();
    p.strokeWeight(6);
    p.endShape(p.CLOSE);

    // Recording process
    // if (recording) {
    //   p.saveCanvas(`loop/frame-${currentFrame.toString().padStart(4, "0")}`);
    // }

    // if (currentFrame === totalFrames - 1) {
    //   recording = false;
    //   p.noLoop();
    // }

    currentFrame = (currentFrame + 1) % totalFrames;
    progress = (currentFrame / totalFrames) * cycles;
  };
};

new P5(sketch);
