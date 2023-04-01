# Blur Detector

npm module for [inspector-bokeh](https://github.com/timotgl/inspector-bokeh)

## Installation

```
npm i blurdetector
```

```
yarn add blurdetector
```

## Usage

support image src:

- [canvas](https://www.npmjs.com/package/canvas#loadimage) loadImage

```javascript
import blurDetector, { fileToBase64 } from 'blurdetector';

const onFileChange = async (e) => {
  // Support String base64/Buffer image
  const result = await blurDetector(fileToBase64(e.target.files[0]));
  console.table({ result })
};
```
