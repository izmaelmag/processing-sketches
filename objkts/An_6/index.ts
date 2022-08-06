import P5 from "p5";
import { Recorder, sine, Colors } from "../../shared";
import { easeInOutSine as easing } from "../../shared/easings";
import * as dat from "dat.gui";

const width = 420;
const height = 420;
const time = 5;

// const imageUrl = new URL(`./dove55.png`, import.meta.url);

let myImage: P5.Image;
let scale: number;
let grayscaleMap: number[];

new Recorder({
  size: { width, height },
  time,
  onPreload: (p: P5) => {
    // p.frameRate(24);
    // myImage = p.loadImage(imageUrl.href, () => {
    //   myImage.loadPixels();
    //   scale = Math.ceil(width / myImage.width);
    //   grayscaleMap = myImage.pixels;
    // });
  },
  onSetup: (p: P5) => {
    p.background(255);
    p.noFill();
    p.noSmooth();
    p.image(myImage, 0, 0, width, height);
  },
  onDraw: (p: P5, progress: number = 0) => {
    // p.background(255);
    // p.noStroke();
    // p.translate(-width / 2, -height / 2);
    // for (let y = 0; y < myImage.height; y++) {
    //   p.beginShape();
    //   for (let x = -1; x < myImage.width; x++) {
    //     let pixelIndex = (x + y * myImage.height) * 4;
    //     let r = grayscaleMap[pixelIndex];
    //     let g = grayscaleMap[pixelIndex + 1];
    //     let b = grayscaleMap[pixelIndex + 2];
    //     let intense = (r + g + b / 3) / 255;
    //     // p.stroke(0);
    //     // p.noFill();
    //     // p.strokeWeight(1);
    //     // p.vertex(px, py - intense * 4);
    //     let pProgress = (progress - y / 255 * 2 + intense * 0.2 + p.map(x, 0, myImage.width, 0, 0.5)) % 1;
    //     let rad = sine({
    //       min: 0,
    //       max: 8,
    //       angle: pProgress * 360,
    //     });
    //     // let yOff =/ 0;
    //     let yOff = sine({ min: 0, max: 10, angle: pProgress * 360 });
    //     let px = (y % 2 ? 5 : 0) + x * scale + scale / 2;
    //     let py = yOff + y * scale + scale / 2;
    //     p.noStroke();
    //     p.fill(py > height / 2 ? Colors.yellow : Colors.blue);
    //     p.ellipse(px, py, rad, rad);
    //   }
    //   p.endShape();
  },

  // p.noLoop();
});
