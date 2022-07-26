# Blur Detector

npm module for [inspector-bokeh](https://github.com/timotgl/inspector-bokeh)

## Installation

```
npm install blur-detector
```

## Usage

support image src:

- [canvas](https://www.npmjs.com/package/canvas#loadimage) loadImage
- File ( html input file )

```javascript
const toBase64 = (fileToConvert) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileToConvert);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const onFileChange = async (e) => {
  const imageBase64 = await toBase64(e.target.files[0]);
  setImage(imageBase64);

  // Support File/String base64/Buffer
  // const result = await blurDetector(imageBase64);
  const result = await blurDetector(e.target.files[0]);
  setBlurScore(result.blurScore);
};
```
