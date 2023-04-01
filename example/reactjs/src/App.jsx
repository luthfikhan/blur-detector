import { useState } from "react";
import blurDetector, { fileToBase64 } from "blurdetector";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [blurScore, setBlurScore] = useState("");

  const onFileChange = async (e) => {
    const imageBase64 = await fileToBase64(e.target.files[0]);
    setImage(imageBase64);

    const result = await blurDetector(imageBase64);
    console.table({ result })
    setBlurScore(result.blurScore);
  };

  return (
    <div className="App">
      <h1>Blur Detector Demo</h1>
      <p>
        Select an image to measure its blur. It will only be processed in your
        browser, not uploaded anywhere.
      </p>
      <input onChange={onFileChange} type="file" accept="image/*" />
      {image && (
        <div>
          <div style={{ padding: "20px 0", color: "aquamarine" }}>
            <div style={{ fontSize: "2rem", marginBottom: "4px" }}>
              Score: {blurScore}
            </div>
            <div>Higher score means more blur.</div>
          </div>
          <img src={image} alt="image" />
        </div>
      )}
    </div>
  );
}

export default App;
