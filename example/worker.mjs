import {ImagePacker} from './build/index.js';

self.onmessage = async function(event) {
  const imagePacker = new ImagePacker();

  function createCanvas(width, height, color = 'white') {
    const canvas = new OffscreenCanvas(width, height, color);
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = '3';
    ctx.strokeStyle = 'blue';
    ctx.font = '40px Arial';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.rect(5, 5, width - 5, height - 5);
    ctx.stroke();
    ctx.fillStyle = `black`;
    ctx.fillText(`${canvas.width}x${canvas.height}`, 30, 50);
    return canvas;
  }

  function addImage(width, height, cols = 1, rows = 1) {
    const color = `rgb(${200 + Math.random() * 55}, ${
        200 + Math.random() * 55}, ${200 + Math.random() * 55})`;
    const canvas = createCanvas(width, height, color);
    imagePacker.addImage(canvas, cols, rows);
  }

  for (let i = 0; i < 100; i++) {
    const w = Math.random() * 32;
    const h = Math.random() * 32;
    addImage(Math.ceil(w * w), Math.ceil(h * h));
  }

  const canvases =
      await imagePacker.pack({maxTextureSize: 2048, numTextureSheets: 16});
  // Create ImageBitmaps from the canvases
  const imageBitmaps =
      await Promise.all(canvases.map(canvas => createImageBitmap(canvas)));

  // Transfer the ImageBitmaps
  postMessage(imageBitmaps, imageBitmaps);
};
