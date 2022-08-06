import P5 from "p5";

interface RecorderParams {
  size: {
    width: number;
    height: number;
  };
  time: number;
  onPreload?: (p: P5) => void;
  onDraw: (p: P5, progress: number) => void;
  onSetup?: (p: P5) => void;
}

export class Recorder {
  // Recording props
  currentFrame: number = 0;
  progress: number = 0;
  recording: boolean = false;
  fps: number = 60;
  recfps: number = 5;
  cycles: number = 1;
  time: number;
  totalFrames: number;

  // Common props
  onPreload: RecorderParams["onPreload"];
  onDraw: RecorderParams["onDraw"];
  onSetup: RecorderParams["onSetup"];
  p: P5;
  canvasSize: {
    width: number;
    height: number;
  };

  debugGraphics: P5.Graphics;

  constructor({
    onDraw,
    onSetup,
    onPreload,
    size = { width: 520, height: 520 },
    time = 5,
  }: RecorderParams) {
    this.onDraw = onDraw;
    this.onPreload = onPreload;
    this.onSetup = onSetup;
    this.canvasSize = size;
    this.time = time;

    this.totalFrames = this.fps * this.time * this.cycles;

    new P5((p: P5) => {
      p.setup = () => this.setup(p);
      p.draw = () => this.draw(p);
      p.preload = () => this.preload(p);

      this.debugGraphics = p.createGraphics(
        this.canvasSize.width,
        this.canvasSize.height
      );
    });
  }

  resetAnimation = (p: P5) => {
    this.currentFrame = 0;
    this.progress = 0;
    this.recording = true;

    p.loop();
  };

  handleRecording = (p: P5) => {
    this.currentFrame = 0;
    p.noLoop();
    p.frameRate(this.recfps);

    if (typeof window !== undefined) {
      window.setTimeout(() => this.resetAnimation(p), 1000);
    } else {
      console.warn(`RECORDER: window object doesn't exist`);
    }
  };

  debug = () => {
    const p = this.debugGraphics;
    const { recording, currentFrame, totalFrames, progress, cycles } = this;

    p.clear(255, 255, 255, 0);
    p.fill(70);
    p.text(`Current frame: ${currentFrame} / ${totalFrames}`, 10, 20);
    p.text(`Progress: ${((progress / cycles) * 100).toFixed()}%`, 10, 40);
    p.text(`Cycles: ${cycles}`, 10, 60);
    p.text(recording ? "REC" : "Playing", 10, 80);

    return this.debugGraphics;
  };

  preload = (p: P5) => {
    if (this.onPreload) this.onPreload(p);
  };

  setup = (p: P5) => {
    p.createCanvas(this.canvasSize.width, this.canvasSize.height);
    p.translate(-this.canvasSize.width / 2, -this.canvasSize.height / 2);
    p.pixelDensity(2);
    p.frameRate(this.fps);

    p.createButton("Rec").mousePressed(() => this.handleRecording(p));

    if (typeof this.onSetup === "function") {
      this.onSetup(p);
    }
  };

  draw = (p: P5) => {
    const { recording, currentFrame, totalFrames, cycles } = this;

    // Animation cycle
    this.onDraw(p, this.progress);

    // Debug data
    if (!recording) {
      // p.image(this.debug(), 0, 0, this.canvasSize, this.canvasSize);
    }

    // Recording process
    if (recording) {
      p.saveCanvas(
        `loop/frame-${currentFrame
          .toString()
          .padStart(totalFrames.toString().length, "0")}`
      );
    }

    if (recording && currentFrame === totalFrames - 1) {
      this.recording = false;
      p.noLoop();
    }

    // Increment progress
    this.currentFrame = (currentFrame + 1) % totalFrames;
    this.progress = (currentFrame / totalFrames) * cycles;
  };
}
