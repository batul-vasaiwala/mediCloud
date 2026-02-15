'use client'
import React, { useState } from 'react'
import { CheckCircle, AlertCircle, Clock, Upload, FileText } from 'lucide-react'
import './verify.css'

export default function VerifyUpload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const f = e.dataTransfer.files[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setResult(null)
    }
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

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  return (
    <div className="verify-container">
      {/* Header */}
      <div className="verify-header">
        <div className="header-content">
          <h1 className="title">AI Prescription Verification</h1>
          <p className="subtitle">Secure & Accurate Document Analysis</p>
        </div>
      </div>

      <div className="verify-content">
        {/* Upload Card */}
        <div className="upload-card" onDragEnter={handleDrag}>
          {!preview ? (
            <div
              className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <Upload size={48} />
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                id="fileInput"
                hidden
                onChange={handleFileChange}
              />
              <label htmlFor="fileInput" className="upload-label">
                <span className="upload-text">
                  Click to upload or drag and drop
                </span>
                <span className="upload-hint">PNG, JPG, PDF (Max 10MB)</span>
              </label>
            </div>
          ) : (
            <div className="preview-section">
              <div className="preview-header">
                <FileText size={20} />
                <span className="file-name">{file?.name}</span>
                <button className="reset-btn" onClick={handleReset} title="Upload new file">
                  ✕
                </button>
              </div>
              <div className="image-box">
                <img src={preview || "/placeholder.svg"} alt="preview" className="preview-image" />
                {loading && (
                  <div className="scan-overlay">
                    <div className="spinner"></div>
                    <p>Scanning Prescription...</p>
                  </div>
                )}
              </div>
              <button
                className="verify-btn"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Scanning...
                  </>
                ) : (
                  'Verify Prescription'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Result Card */}
        {result && (
          <div className="result-card">
            <div className="result-header">
              <h3>Verification Result</h3>
              <button className="close-result" onClick={handleReset}>✕</button>
            </div>

            {/* Overall Score */}
            <div className="score-section">
              <div className="score-circle">
                <svg viewBox="0 0 100 100" className="progress-ring">
                  <circle cx="50" cy="50" r="40" className="progress-ring-circle" style={{
                    strokeDasharray: `${2 * Math.PI * 40}`,
                    strokeDashoffset: `${2 * Math.PI * 40 - (result.overall_score / 100) * 2 * Math.PI * 40}`
                  }} />
                </svg>
                <div className="score-text">
                  <span className="score-number">{result.overall_score}%</span>
                  <span className="score-label">Score</span>
                </div>
              </div>
              <div className="status-badge">
                <div className={`status-indicator ${result.status.toLowerCase()}`}>
                  {result.status.toLowerCase() === 'valid' ? (
                    <CheckCircle size={24} />
                  ) : (
                    <AlertCircle size={24} />
                  )}
                </div>
                <span className="status-text">{result.status}</span>
              </div>
            </div>

            {/* Rule Checks */}
            <div className="checks-section">
              <h4>Document Verification Checks</h4>
              <div className="checks-grid">
                {Object.entries(result.checks).map(([key, val]) => (
                  <div key={key} className={`check-item ${val.present ? 'passed' : 'failed'}`}>
                    <div className="check-icon">
                      {val.present ? (
                        <CheckCircle size={20} />
                      ) : (
                        <AlertCircle size={20} />
                      )}
                    </div>
                    <div className="check-details">
                      <span className="check-name">{key.replace(/_/g, ' ')}</span>
                      <span className="check-confidence">Confidence: {val.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Analysis */}
            <div className="signature-section">
              <h4>Signature Analysis</h4>
              <div className="signature-details">
                <div className={`signature-status ${result.signature.present ? 'detected' : 'not-detected'}`}>
                  <span className="signature-label">Signature</span>
                  <span className="signature-value">
                    {result.signature.present ? '✓ Detected' : '✗ Not Detected'}
                  </span>
                </div>
                <div className="signature-confidence">
                  <span className="confidence-label">Match Confidence</span>
                  <span className="confidence-value">{result.signature.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Layout Similarity */}
            <div className="layout-section">
              <h4>Layout Analysis</h4>
              <div className="layout-bar">
                <div className="layout-fill" style={{width: `${result.layout_score}%`}}></div>
              </div>
              <span className="layout-score">{result.layout_score}% Similarity</span>
            </div>

            {/* Action Buttons */}
            <div className="result-actions">
              <button className="action-btn primary" onClick={handleReset}>
                Verify Another
              </button>
              <button className="action-btn secondary">
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
