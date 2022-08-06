import P5, { MediaElement } from "p5";
import { sine, Colors, polyPoints } from "../../shared";

const sketch = (p: P5) => {
  let size = 520;
  let center = size / 2;
  let maxCycles = 5;
  let currentAngle = 0;
  let currentFrame = 0;
  let play = true;
  let canvas: HTMLCanvasElement;
  let mediaChunks: Blob[] = [];
  let mediaRecorder: MediaRecorder;
  let video: MediaElement;
  let milliseconds = 8000;
  let fps = 60;
  let frames = fps / milliseconds;
  let anglePerFrame = (Math.PI * 2) / frames;

  p.mouseClicked = () => {
    p.loop();
    play = true;
    currentAngle = 0;
    currentFrame = 0;

    mediaRecorder.start();
  };

  p.preload = () => {
    // p.noLoop();
    video = p.createVideo("");
  };

  p.setup = () => {
    let canvasInstance = p.createCanvas(size, size);
    canvas = canvasInstance.elt;

    mediaRecorder = new MediaRecorder(canvas.captureStream(60));

    mediaRecorder.ondataavailable = (e: BlobEvent) => {
      mediaChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      var blob = new Blob(mediaChunks, { type: "video/webm" });
      video.src = URL.createObjectURL(blob);
      video.loop();
      video.play();

      mediaChunks = [];
    };

    p.noStroke();
    p.pixelDensity(2);
  };

  p.draw = () => {
    p.background(250);

    currentAngle = (anglePerFrame * currentFrame) % (360 * maxCycles);

    // First circle
    let vertCount1 = sine({ min: 0, max: 8, angle: currentAngle / 5 });
    let radius1 = sine({ min: 50, max: 150, angle: currentAngle / 10 });
    let startAngle1 = sine({
      min: 0,
      max: p.TWO_PI * 2,
      angle: currentAngle / 5,
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
    let vertCount2 = sine({ min: 0, max: 12, angle: currentAngle / 5 });
    let radius2 = sine({
      min: -100,
      max: 100,
      angle: currentAngle / 10,
      phase: 1,
    });
    let startAngle2 = sine({
      min: 0,
      max: p.TWO_PI * 2,
      angle: currentAngle / 10,
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

    // if (currentAngle < 10 && currentFrame > 1) {
    //   play = false;
    //   p.noLoop();
    //   console.log(currentFrame);
    //   mediaRecorder.stop();
    // }

    // Increase frame timer
    currentFrame += play ? 1 : 0;
  };
};

new P5(sketch);
