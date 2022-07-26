const measureBlur = require("./src/measureBlur");
const canvasModule = require("canvas");

const { createCanvas, loadImage } = canvasModule;

const toBase64 = (fileToConvert) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileToConvert);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

/**
 * @param  {String|Buffer|File} src
 */
const blurDetector = async (src) => {
  if (src instanceof File) {
    src = await toBase64(src);
  }

  const image = await loadImage(src);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const stats = measureBlur(
    context.getImageData(0, 0, canvas.width, canvas.height)
  );
  return stats;
};

module.exports = blurDetector;
