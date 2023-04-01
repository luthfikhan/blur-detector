import { createCanvas, loadImage } from 'canvas';
import measureBlur from './measureBlur';

export const fileToBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  }
);
/**
 * Detects blur level of an image from a base64-encoded string or a Buffer.
 * @param src The base64-encoded string or Buffer representing the image.
 *            If a string, it should be base64-encoded.
 */
const blurDetector = async (src: string | Buffer) => {
  const image = await loadImage(src);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const stats = measureBlur(
    context.getImageData(0, 0, canvas.width, canvas.height)
  );
  return stats;
};

export default blurDetector;
