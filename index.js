const measureBlur = require("./measureBlur");
const canvasModule = require("canvas");

const { createCanvas, loadImage } = canvasModule;
/**
 * @param  {String|Buffer} src
 */
const blurDetector = async (src) => {
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
