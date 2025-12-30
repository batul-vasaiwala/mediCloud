'use client'
import React, { useState } from 'react'
import './verify.css'

export default function VerifyUpload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please upload a file')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(
        'http://localhost:5000/api/verify-prescription',
        {
          method: 'POST',
          body: formData
        }
      )

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      alert('Verification failed. Check backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="verify-container">
      <h2 className="title">AI Prescription Verification</h2>

      {/* Upload Card */}
      <div className="upload-card">
        <input
          type="file"
          accept="image/*,.pdf"
          id="fileInput"
          hidden
          onChange={handleFileChange}
        />

        <label htmlFor="fileInput" className="upload-btn">
          Upload Prescription
        </label>

        {preview && (
          <div className="image-box">
            <img src={preview} alt="preview" />
            {loading && <div className="scan-overlay" />}
          </div>
        )}

        <button
          className="verify-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Scanning...' : 'Verify Prescription'}
        </button>
      </div>

      {/* Result */}
{result && (
  <div className="result-card">
    <h3>Verification Result</h3>

    <div className="score">
      Overall Score: <span>{result.score}%</span>
    </div>

    <div className={`status ${result.status.toLowerCase()}`}>
      {result.status}
    </div>

    <h4>Rule Checks</h4>
    <ul className="details">
      {Object.entries(result.checks).map(([key, val]) => (
        <li key={key}>
          <span>{key}</span>
          <span>
            {val.present ? '✅' : '❌'} ({val.confidence}%)
          </span>
        </li>
      ))}
    </ul>

    <h4>Signature Analysis</h4>
    <p>
      Detected: {result.signature.present ? '✅' : '❌'}
    </p>
    <p>
      Match Confidence: {result.signature.confidence}%
    </p>

    <h4>Layout Similarity</h4>
    <p>{result.layout_score}%</p>
  </div>
)}

    </div>
  )
}
