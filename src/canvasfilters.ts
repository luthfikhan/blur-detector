/* eslint-disable no-undef */
// this is just a copy of https://github.com/kig/canvasfilters/blob/master/filters.js
// that has been modified to be an ES module.
// TODO: somehow bundle the original npm package as an ES module

import { ImageData } from "canvas";

export type PartialImageData = {
  width: number;
  height: number;
  data: any[] | Float32Array;
}

export const getFloat32Array = (len: number[] | number) => {
  if (typeof Float32Array === "undefined") {
    if (Array.isArray(len)) {
      return len.slice(0);
    }
    return new Array(len);
  } else {
    if (Array.isArray(len)) {
      return new Float32Array(len)
    }

    return new Float32Array(len);
  }
}

export const createImageData = (w: number, h: number) => {
  return { width: w, height: h, data: getFloat32Array(w * h * 4) };
};

export const createImageDataFloat32 = function (w: number, h: number) {
  return { width: w, height: h, data: getFloat32Array(w * h * 4) };
};

export const identity = function (pixels: ImageData | PartialImageData) {
  let output = createImageData(pixels.width, pixels.height);
  let dst = output.data;
  let d = pixels.data;
  for (let i = 0; i < d.length; i++) {
    dst[i] = d[i];
  }
  return output;
};

export const luminance = (pixels : ImageData | PartialImageData) => {
  let output = createImageData(pixels.width, pixels.height);
  let dst = output.data;
  let d = pixels.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];
    // CIE luminance for the RGB
    let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    dst[i] = dst[i + 1] = dst[i + 2] = v;
    dst[i + 3] = d[i + 3];
  }
  return output;
};

export const convolve = (pixels: PartialImageData, weights: any[] | Float32Array, opaque: boolean) => {
  let side = Math.round(Math.sqrt(weights.length));
  let halfSide = Math.floor(side / 2);

  let src = pixels.data;
  let sw = pixels.width;
  let sh = pixels.height;

  let w = sw;
  let h = sh;
  let output = createImageData(w, h);
  let dst = output.data;

  let alphaFac = opaque ? 1 : 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sy = y;
      let sx = x;
      let dstOff = (y * w + x) * 4;
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          let scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
          let scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
          let srcOff = (scy * sw + scx) * 4;
          let wt = weights[cy * side + cx];
          r += src[srcOff] * wt;
          g += src[srcOff + 1] * wt;
          b += src[srcOff + 2] * wt;
          a += src[srcOff + 3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};


export const horizontalConvolve = (pixels: PartialImageData, weightsVector: any[] | Float32Array, opaque: boolean) => {
  let side = weightsVector.length;
  let halfSide = Math.floor(side / 2);

  let src = pixels.data;
  let sw = pixels.width;
  let sh = pixels.height;

  let w = sw;
  let h = sh;
  let output = createImageData(w, h);
  let dst = output.data;

  let alphaFac = opaque ? 1 : 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sy = y;
      let sx = x;
      let dstOff = (y * w + x) * 4;
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let cx = 0; cx < side; cx++) {
        let scy = sy;
        let scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
        let srcOff = (scy * sw + scx) * 4;
        let wt = weightsVector[cx];
        r += src[srcOff] * wt;
        g += src[srcOff + 1] * wt;
        b += src[srcOff + 2] * wt;
        a += src[srcOff + 3] * wt;
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};

export const verticalConvolveFloat32 = (pixels: ImageData | PartialImageData, weightsVector: any[] | Float32Array, opaque: boolean) => {
  let side = weightsVector.length;
  let halfSide = Math.floor(side / 2);

  let src = pixels.data;
  let sw = pixels.width;
  let sh = pixels.height;

  let w = sw;
  let h = sh;
  let output = createImageDataFloat32(w, h);
  let dst = output.data;

  let alphaFac = opaque ? 1 : 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sy = y;
      let sx = x;
      let dstOff = (y * w + x) * 4;
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let cy = 0; cy < side; cy++) {
        let scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
        let scx = sx;
        let srcOff = (scy * sw + scx) * 4;
        let wt = weightsVector[cy];
        r += src[srcOff] * wt;
        g += src[srcOff + 1] * wt;
        b += src[srcOff + 2] * wt;
        a += src[srcOff + 3] * wt;
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};

export const separableConvolve = function (
  pixels: ImageData | PartialImageData,
  horizWeights: any[] | Float32Array,
  vertWeights: any[] | Float32Array,
  opaque: boolean
) {
  return horizontalConvolve(
    verticalConvolveFloat32(pixels, vertWeights, opaque),
    horizWeights,
    opaque
  );
};

export const gaussianBlur = function (pixels: ImageData | PartialImageData, diameter: number) {
  diameter = Math.abs(diameter);
  if (diameter <= 1) return identity(pixels);
  let radius = diameter / 2;
  let len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2));
  let weights = getFloat32Array(len);
  let rho = (radius + 0.5) / 3;
  let rhoSq = rho * rho;
  let gaussianFactor = 1 / Math.sqrt(2 * Math.PI * rhoSq);
  let rhoFactor = -1 / (2 * rho * rho);
  let wsum = 0;
  let middle = Math.floor(len / 2);
  for (let i = 0; i < len; i++) {
    let x = i - middle;
    let gx = gaussianFactor * Math.exp(x * x * rhoFactor);
    weights[i] = gx;
    wsum += gx;
  }
  for (let i = 0; i < weights.length; i++) {
    weights[i] /= wsum;
  }
  return separableConvolve(pixels, weights, weights, false);
};
