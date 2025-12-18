
import React, { useState, useEffect } from "react";
import axios from "axios";
import './add-prescription.css'
export default function AddPrescription() {
  const [email, setEmail] = useState("");
  const [patient, setPatient] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [labTests, setLabTests] = useState([]);
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", times: { morning: false, midday: false, night: false }, instruction: "", durationDays: 1 }
  ]);
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(false);

  // preview states
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewGenerating, setPreviewGenerating] = useState(false);
  const [savingFinal, setSavingFinal] = useState(false);

  const SYMPTOM_OPTIONS = ["Fever", "Cough", "Headache", "Sore throat", "Breathlessness", "Chest pain", "Fatigue"];
  const LAB_OPTIONS = ["CBC", "RFT", "LFT", "Lipid Profile", "Blood Sugar", "Urine Routine"];

  function calculateAge(dob) {
  if (!dob) return "-";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

  async function fetchPatient() {
    if (!email) return alert("Enter email");
    try {
      const res = await axios.get("http://localhost:5000/api/prescriptions/patient", {
        params: { email }
      });
      setPatient(res.data);
    } catch (err) {
      setPatient(null);
      alert(err.response?.data?.message || "Patient not found");
    }
  }
async function onPatientEmailChange(email) {
  if (!email.includes("@")) return;

  try {
    const res = await axios.get(
      "http://localhost:5000/api/prescriptions/patient",
      { params: { email } }
    );

    setPatient(res.data);
  } catch {
    setPatient(null);
  }
}

  function toggleSymptom(name) {
    setSymptoms(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  }

  function addCustomSymptom() {
    if (!customSymptom.trim()) return;
    toggleSymptom(customSymptom.trim());
    setCustomSymptom("");
  }

  function addMedicineRow() {
    setMedicines([...medicines, { name: "", dosage: "", times: { morning: false, midday: false, night: false }, instruction: "", durationDays: 1 }]);
  }
  function removeMedicineRow(i) {
    setMedicines(medicines.filter((_, idx) => idx !== i));
  }
  function updateMedicine(i, field, value) {
    const copy = [...medicines];
    copy[i][field] = value;
    setMedicines(copy);
  }
  function toggleMedicineTime(i, key) {
    const copy = [...medicines];
    copy[i].times[key] = !copy[i].times[key];
    setMedicines(copy);
  }

  function toggleLab(test) {
    setLabTests(prev => prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]);
  }

  // Generate preview (no DB save, no GridFS upload)
  async function generatePreview() {
    if (!patient) return alert("Fetch patient first");

    const doctor = JSON.parse(localStorage.getItem("doctor"));
    if (!doctor || !doctor._id) return alert("Doctor not logged in (missing _id).");

    setPreviewGenerating(true);
    // cleanup old preview
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }

    try {
      const payload = {
        doctorId: doctor._id,
        patientEmail: patient.email,
        symptoms,
        diagnosis,
        medicines,
        labTests,
        notes,
        followUpDate
      };

      const res = await axios.post("http://localhost:5000/api/prescriptions/preview", payload, {
        responseType: "arraybuffer",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error("Preview error:", err);
      alert(err.response?.data?.error || "Failed to generate preview");
    } finally {
      setPreviewGenerating(false);
    }
  }

  // Save final: create prescription record and upload to GridFS (existing /create)
  async function saveFinalFromPreview() {
    if (!patient) return alert("Fetch patient first");
    const doctor = JSON.parse(localStorage.getItem("doctor"));
    if (!doctor || !doctor._id) return alert("Doctor not logged in (missing _id).");

    setSavingFinal(true);
    try {
      const payload = {
        doctorId: doctor._id,
        patientEmail: patient.email,
        symptoms,
        diagnosis,
        medicines,
        labTests,
        notes,
        followUpDate
      };

      const res = await axios.post("http://localhost:5000/api/prescriptions/create", payload, {
        responseType: "json"
      });

      if (res.data && res.data.success) {
        // Close preview and show success
        setIsPreviewOpen(false);
        alert("Prescription saved to cloud (GridFS). It will appear in dashboards.");
      } else {
        alert(res.data?.error || "Saved but response unexpected.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.error || "Failed to save prescription");
    } finally {
      setSavingFinal(false);
    }
  }

  // If user closes the preview modal, revoke blob URL
  function closePreview() {
    setIsPreviewOpen(false);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  }

  // Small helper: submit previous "Save & Generate" single-click behavior (kept for compatibility)
  async function submitLegacy() {
    // This preserves your previous single-button behavior, but try to use Generate Preview + Save instead.
    if (!patient) return alert("Fetch patient first");
    const doctor = JSON.parse(localStorage.getItem("doctor"));
    if (!doctor || !doctor._id) return alert("Doctor not logged in (missing _id).");
    setLoading(true);
    try {
      const payload = {
        doctorId: doctor._id,
        patientEmail: patient.email,
        symptoms,
        diagnosis,
        medicines,
        labTests,
        notes,
        followUpDate
      };

      const res = await axios.post("http://localhost:5000/api/prescriptions/create", payload);
      console.log("SERVER RESPONSE:", res.data);
      alert("Prescription created on cloud.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // optional: ensure we cleanup blob when component unmounts
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  return (
     <div className="prescription-page">
    <div className="prescription-container">
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Add Prescription</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Patient Email</label><br/>
        <input  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    onPatientEmailChange(e.target.value);
  }} style={{ width: 300, padding: 8 }} placeholder="patient@example.com" />
        <button onClick={fetchPatient} style={{ marginLeft: 8 }}>Fetch</button>
      </div>

      {patient && (
        <div style={{ marginBottom: 12, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <div><strong>{patient.fullName}</strong></div>
          <div>Email: {patient.email}</div>
          <div>
  Gender: {patient.gender} | Age: {calculateAge(patient.dateOfBirth)} yrs
</div>

          <div>Height: {patient.height || "-"}  Weight: {patient.weight || "-"}</div>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <div><strong>Symptoms</strong></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {SYMPTOM_OPTIONS.map(s => (
            <button key={s}
              onClick={() => toggleSymptom(s)}
              style={{
                padding: "6px 10px",
                borderRadius: 20,
                border: symptoms.includes(s) ? "2px solid #0b84ff" : "1px solid #ddd",
                background: symptoms.includes(s) ? "#e8f2ff" : "#fff",
                cursor: "pointer"
              }}>{s}</button>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Add custom symptom" value={customSymptom} onChange={e=>setCustomSymptom(e.target.value)} />
          <button onClick={addCustomSymptom} style={{ marginLeft: 8 }}>Add</button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label><strong>Diagnosis</strong></label>
        <br />
        <textarea value={diagnosis} onChange={e=>setDiagnosis(e.target.value)} rows={3} style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div><strong>Medicines</strong></div>
        {medicines.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <input placeholder="Medicine name" value={m.name} onChange={e=>updateMedicine(i, "name", e.target.value)} />
            <input placeholder="Dosage (e.g., 500mg)" value={m.dosage} onChange={e=>updateMedicine(i, "dosage", e.target.value)} />
            <div>
              <label><input type="checkbox" checked={m.times.morning} onChange={()=>toggleMedicineTime(i,"morning")} /> Morning</label><br/>
              <label><input type="checkbox" checked={m.times.midday} onChange={()=>toggleMedicineTime(i,"midday")} /> Midday</label><br/>
              <label><input type="checkbox" checked={m.times.night} onChange={()=>toggleMedicineTime(i,"night")} /> Night</label>
            </div>
            <input placeholder="Instruction (after food)" value={m.instruction} onChange={e=>updateMedicine(i,"instruction",e.target.value)} />
            <input type="number" min="1" value={m.durationDays} onChange={e=>updateMedicine(i,"durationDays",Number(e.target.value))} style={{ width: 80 }} />
            {i>0 && <button onClick={()=>removeMedicineRow(i)}>Remove</button>}
          </div>
        ))}
        <button onClick={addMedicineRow} style={{ marginTop: 8 }}>+ Add medicine</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div><strong>Lab tests (recommend)</strong></div>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          {LAB_OPTIONS.map(t => (
            <label key={t} style={{ padding: 6, border: labTests.includes(t) ? "2px solid #0b84ff" : "1px solid #ddd", borderRadius: 6 }}>
              <input type="checkbox" checked={labTests.includes(t)} onChange={()=>toggleLab(t)} /> {t}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label><strong>Additional notes</strong></label><br/>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label><strong>Follow-up date (optional)</strong></label><br/>
        <input type="date" value={followUpDate} onChange={e=>setFollowUpDate(e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={generatePreview} disabled={previewGenerating}>{previewGenerating ? "Generating preview..." : "Generate Preview"}</button>
        <button onClick={submitLegacy} disabled={loading}>{loading ? "Saving..." : "Save & Generate (legacy)"}</button>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{ width: "90%", height: "90%", background: "#fff", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><strong>Prescription Preview</strong></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={closePreview}>Back</button>
                <button onClick={saveFinalFromPreview} disabled={savingFinal}>{savingFinal ? "Saving..." : "Save Prescription"}</button>
              </div>
            </div>

            <div style={{ flex: 1, background: "#ccc" }}>
              {previewBlobUrl ? (
                <iframe title="prescription-preview" src={previewBlobUrl} style={{ width: "100%", height: "100%", border: 0 }} />
              ) : (
                <div style={{ padding: 20 }}>Loading preview...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}
