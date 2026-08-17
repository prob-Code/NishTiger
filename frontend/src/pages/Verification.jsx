import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Verification() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const API_BASE = "https://nishtiger-1.onrender.com/api";

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage({
          file: file,
          url: event.target.result,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage?.file) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage.file);

      const response = await fetch(`${API_BASE}/ai/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          class: data.result.label || data.result.species,
          confidence: data.result.confidence,
          individual: data.result.individual,
          status: data.result.status,
          note: data.result.note,
          raw: JSON.stringify(data.predictions, null, 2)
        });
      } else {
        alert(data.message || "Failed to analyze image");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to AI backend");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <header className="topbar" style={{ marginBottom: '24px' }}>
        <div>
          <p className="eyebrow">AI CAMERA-TRAP TRIAGE</p>
          <h1 style={{ fontSize: '29px', margin: '2px 0 0' }}>Image Verification</h1>
        </div>
        <Link className="secondary-btn" to="/dashboard">← Dashboard</Link>
      </header>

      <section className="verification-layout">
        <div className="card upload-card">
          <div className="card-head">
            <div>
              <h2>Upload camera-trap image</h2>
              <p>JPG, PNG or WEBP • maximum 10 MB</p>
            </div>
            <span className="status-dot">AI READY</span>
          </div>

          <input 
            id="imageInput" 
            type="file" 
            accept="image/jpeg,image/png,image/webp" 
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />

          {!selectedImage ? (
            <label htmlFor="imageInput" className="dropzone">
              <div className="upload-icon">📷</div>
              <h3>Choose an image</h3>
              <p>Click here to browse or drag a camera-trap image into this area.</p>
              <span className="secondary-btn">Select image</span>
            </label>
          ) : (
            <div className="preview-wrap">
              <img src={selectedImage.url} alt="Selected camera trap image" />
              <div className="file-meta">
                <span>{selectedImage.name}</span>
                <span>{selectedImage.size}</span>
              </div>
              <button 
                className="secondary-btn" 
                style={{ marginTop: '10px', fontSize: '12px', padding: '6px 10px' }}
                onClick={() => { setSelectedImage(null); setResult(null); }}
              >
                Change Image
              </button>
            </div>
          )}

          <button 
            className="primary-btn full" 
            disabled={!selectedImage || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? 'Analyzing...' : '🔍 Upload & Detect'}
          </button>
        </div>

        <div className="card result-card">
          <div className="card-head">
            <div>
              <h2>AI Result</h2>
              <p>Species-level camera-trap triage</p>
            </div>
          </div>
          
          {!result && !isAnalyzing && (
            <div className="empty-state">
              <div>🤖</div>
              <h3>No image analysed yet</h3>
              <p>Upload an image to see the detection result.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="empty-state">
              <div className="upload-icon" style={{ animation: 'pulse 1s infinite' }}>⏳</div>
              <h3>Analysing...</h3>
              <p>Running YOLO inference...</p>
            </div>
          )}

          {result && (
            <div>
              <div className="result-badge" style={{ backgroundColor: '#183d31', color: '#a8e58b' }}>
                🐅 {result.class} Detected
              </div>
              <div className="confidence">
                <span>Confidence</span>
                <strong>{result.confidence}%</strong>
              </div>
              <div className="confidence-bar">
                <div style={{ width: `${result.confidence}%` }}></div>
              </div>
              <div className="result-grid">
                <div><small>Individual</small><b>{result.individual}</b></div>
                <div><small>Status</small><b>{result.status}</b></div>
                <div><small>Camera</small><b>PTR-C03</b></div>
                <div><small>Zone</small><b>Sitaghat</b></div>
              </div>
              <div className="info-box">
                {result.note}
              </div>
              <details className="raw-box">
                <summary>Raw AI predictions</summary>
                <pre>{result.raw}</pre>
              </details>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
