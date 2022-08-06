import P5, { MediaElement } from "p5";

const sketch = (p: P5) => {
  let size = 520;

  // Recorder
  let currentFrame: number = 0;
  let progress: number = 0;
  let mediaChunks: Blob[] = [];
  let canvasInstance: P5.Renderer = null;
  let mediaRecorder: MediaRecorder = null;
  let videoElt: P5.MediaElement;

  // Loop options
  const fps = 60;
  const time = 7;
  const cycles = 2;
  const totalFrames = fps * time * cycles;

  p.mouseClicked = () => {
    currentFrame = 0;
    mediaRecorder.state !== "recording" && mediaRecorder.start();
  };

  p.setup = () => {
    p.noStroke();

    videoElt = p.createVideo("");

    // Create P5 canvas renderer
    canvasInstance = p.createCanvas(size, size);

    // Set up media encoder on canvas stream
    mediaRecorder = new MediaRecorder(canvasInstance.elt.captureStream(fps));

    // Merge blob data chunks
    mediaRecorder.ondataavailable = (e: BlobEvent) => {
      mediaChunks.push(e.data);
    };

    // Stop capture: create video element, reset blob data and play the video
    mediaRecorder.onstop = () => {
      const blob = new Blob(mediaChunks, { type: "video/mp4" });
      const videoSource = URL.createObjectURL(blob);
      videoElt.src = URL.createObjectURL(blob);
      videoElt.loop();
      videoElt.play();

      const videoLink = p.createA(videoSource, "Download", "_blank");
      videoLink.addClass("video");

      mediaChunks = [];
    };

    p.frameRate(fps);
    p.pixelDensity(2);
  };

  p.draw = () => {
    let isRecording = mediaRecorder.state === "recording";

    isRecording && mediaRecorder.requestData();

    if (currentFrame === totalFrames + 1) {
      currentFrame = 0;
      isRecording && mediaRecorder.stop();
    }

    p.background(255);

    // Debug data
    p.noStroke();
    p.fill(70);
    p.text(`Current frame: ${currentFrame} / ${totalFrames}`, 10, 20);
    p.text(`Progress: ${((progress / cycles) * 100).toFixed()}%`, 10, 40);
    p.text(`Cycles: ${cycles}`, 10, 60);
    p.fill(isRecording ? "green" : "#ffbb00");
    p.text(isRecording ? "Recording" : "Idle", 10, 80);

    // Play sequence
    if (isRecording) currentFrame = currentFrame + 1;
    progress = (currentFrame / totalFrames) * cycles;

    // Animation cycle
    p.noStroke();
    p.fill(30);
    let p1Coords = {
      x: size / 2 + 100 * Math.cos(p.TWO_PI * 1.5 * -progress),
      y: size / 2 + 100 * Math.sin(p.TWO_PI * 1.5 * -progress),
    };

    p.circle(p1Coords.x, p1Coords.y, 40);
    p.circle(
      p1Coords.x + 50 * Math.cos(p.TWO_PI * progress),
      p1Coords.y + 50 * Math.sin(p.TWO_PI * progress),
      20
    );

    p.noFill();
    p.stroke(30);
    p.circle(size / 2, size / 2, 200);
    p.circle(p1Coords.x, p1Coords.y, 100);
  };
};

new P5(sketch);
