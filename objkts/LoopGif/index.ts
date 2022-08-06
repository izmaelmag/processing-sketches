import P5, { MediaElement } from "p5";

const sketch = (p: P5) => {
  let size = 520;

  // Recorder
  let currentFrame: number = 0;
  let progress: number = 0;
  let recording: boolean = false;
  let resultGraphics: P5.Graphics = null;

  // Loop options
  const fps = 60;
  const recfps = 5;
  const time = 3;
  const cycles = 1;
  const totalFrames = fps * time * cycles;

  p.mouseClicked = () => {
    p.noLoop()
    currentFrame = 0;

    p.frameRate(recfps);
    
    window.setTimeout(() => {
      recording = true;
      p.loop()
    }, 2000)
  };

  p.setup = () => {
    // Create P5 canvas renderer
    p.createCanvas(size, size);
    p.pixelDensity(2);
    p.frameRate(fps);

    resultGraphics = p.createGraphics(size * totalFrames, size);
  };

  p.draw = () => {
    p.background(255);
    p.noStroke();

    // Debug data
    p.fill(70);
    p.text(`Current frame: ${currentFrame} / ${totalFrames}`, 10, 20);
    p.text(`Progress: ${((progress / cycles) * 100).toFixed()}%`, 10, 40);
    p.text(`Cycles: ${cycles}`, 10, 60);
    p.text(recording ? "REC" : "Playing", 10, 80);

    // Animation cycle
    p.noStroke();
    p.fill(30);

    p.circle(
      size / 2 + 100 * Math.cos(p.TWO_PI * -progress),
      size / 2 + 100 * Math.sin(p.TWO_PI * -progress),
      40
    );

    p.noFill();
    p.stroke(30);
    p.circle(size / 2, size / 2, 200);

    if (!recording) {
      currentFrame = (currentFrame + 1) % totalFrames;
      progress = (currentFrame / totalFrames) * cycles;
    }

    if (recording) {
      if (currentFrame === totalFrames) {
        recording = false;
        p.noLoop();
      } else {
        p.saveCanvas(`loop/frame-${currentFrame.toString().padStart(4, '0')}`)
        currentFrame = (currentFrame + 1) % totalFrames;
        progress = (currentFrame / totalFrames) * cycles;
      }
    }

    // Play sequence
  };
};

new P5(sketch);
