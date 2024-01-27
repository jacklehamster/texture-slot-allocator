import {ImagePacker} from './dist/index.js';

self.onmessage = async function(event) {
  const imagePacker = new ImagePacker();

  function createCanvas(width, height, color = 'white') {
    const canvas = new OffscreenCanvas(width, height, color);
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = '3';
    ctx.strokeStyle = 'blue';
    ctx.font = '100px Arial';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.rect(5, 5, width - 5, height - 5);
    ctx.stroke();
    ctx.fillStyle = `black`;
    ctx.fillText(`${canvas.width}x${canvas.height}`, 30, 100);
    return canvas;
  }

  function addImage(id, width, height, cols = 1, rows = 1) {
    const color = `rgb(${200 + Math.random() * 55}, ${
        200 + Math.random() * 55}, ${200 + Math.random() * 55})`;
    const canvas = createCanvas(width, height, color);
    imagePacker.addImage(id, canvas, cols, rows);
  }

  for (let i = 0; i < 100; i++) {
    const w = Math.random() * 32;
    const h = Math.random() * 32;
    addImage(`image_${i}`, Math.ceil(w * w), Math.ceil(h * h));
  }

  const {images, compact, textureSize} = await imagePacker.pack();

  // Transfer the ImageBitmaps
  postMessage({images, compact, textureSize}, images);
};
