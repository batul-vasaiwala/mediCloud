// controllers/prescriptionController.js
import PDFDocument from "pdfkit";
import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Prescription from "../models/prescription.js";
import { GridFSBucket } from "mongodb";
import fs from "fs";
import path from "path";


/**
 * Helper: create PDF buffer from prescription data
 * - doctor: doctor doc (lean)
 * - patientSnapshot: snapshot object
 * - prescriptionData: the prescription object or raw request body to print fields
 */
// function createPrescriptionPDFBuffer({ doctor, patientSnapshot, prescriptionData }) {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 40, size: "A4" });
//       const buffers = [];
//       doc.on("data", (b) => buffers.push(b));
//       doc.on("end", () => resolve(Buffer.concat(buffers)));

//       // Header (clinic + doctor)
//       doc.fontSize(16).text(doctor.clinicName || doctor.name || "Clinic", { align: "center" });
//       if (doctor.name) doc.fontSize(12).text(`${doctor.name} ${doctor.specialization || ""}`, { align: "center" });
//       if (doctor.license) doc.text(`Reg: ${doctor.license}`, { align: "center" });
//       if (doctor.phone) doc.text(doctor.phone, { align: "center" });
//       doc.moveDown();
//       doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke();
//       doc.moveDown();

//       // Patient snapshot
//       doc.fontSize(12).text(`Patient: ${patientSnapshot?.fullName || "-"}`);
//       doc.text(
//         `Email: ${patientSnapshot?.email || "-"}    Gender: ${patientSnapshot?.gender || "-"}    DOB: ${patientSnapshot?.dateOfBirth || "-"}`
//       );
//       if (patientSnapshot?.height || patientSnapshot?.weight) {
//         doc.text(`Height: ${patientSnapshot?.height || "-"}    Weight: ${patientSnapshot?.weight || "-"}`);
//       }
//       doc.moveDown();

//       // Symptoms
//       if (prescriptionData.symptoms?.length) {
//         doc.fontSize(12).text("Symptoms: " + prescriptionData.symptoms.join(", "));
//         doc.moveDown();
//       }

//       // Diagnosis
//       doc.fontSize(12).text("Diagnosis:");
//       doc.fontSize(11).text(prescriptionData.diagnosis || "-", { indent: 10 });
//       doc.moveDown();

//       // Medicines
//       if (prescriptionData.medicines?.length) {
//         doc.fontSize(12).text("Medicines:");
//         prescriptionData.medicines.forEach((m, idx) => {
//           const times = [
//             m.times?.morning ? "M" : "",
//             m.times?.midday ? "Mid" : "",
//             m.times?.night ? "N" : ""
//           ].filter(Boolean).join(", ");
//           doc.fontSize(11).text(`${idx + 1}. ${m.name || "-"} — ${m.dosage || "-"} — ${times || "-"} — ${m.durationDays || "-"} day(s) ${m.instruction ? ` — ${m.instruction}` : ""}`);
//         });
//         doc.moveDown();
//       }

//       // Lab tests
//       if (prescriptionData.labTests?.length) {
//         doc.fontSize(12).text("Recommended Tests:");
//         doc.fontSize(11).text(prescriptionData.labTests.join(", "), { indent: 10 });
//         doc.moveDown();
//       }

//       // Notes
//       if (prescriptionData.notes) {
//         doc.fontSize(12).text("Additional notes:");
//         doc.fontSize(11).text(prescriptionData.notes, { indent: 10 });
//         doc.moveDown();
//       }

//       // Signature (if available)
//       if (doctor.signatureUrl) {
//         try {
//           // If doctor.signatureUrl is a server-relative path (uploads/...), PDFKit will load it
//           doc.image(doctor.signatureUrl, doc.page.width - 160, doc.y, { width: 120 });
//         } catch (e) {
//           // ignore signature load errors
//         }
//       }

//       doc.moveDown();
//       doc.text(`Date: ${new Date().toLocaleString()}`, { align: "left" });

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }
function calculateAge(dob) {
  if (!dob) return "-";

  const birth = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

function createPrescriptionPDFBuffer({ doctor, patientSnapshot, prescriptionData }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const buffers = [];
      doc.on("data", (b) => buffers.push(b));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Header: Clinic block
      const clinicName = doctor.clinicName || "MediCloud HealthCare";
      const docName = doctor.name ? `Dr. ${doctor.name}` : "Dr. (Name)";
      const qualification = doctor.qualification || doctor.specialization || "";
      const address = doctor.clinicAddress || "";
      const phone = doctor.phone || "";
      const reg = doctor.license ? `Reg.: ${doctor.license}` : "";

      // Top header box
      doc.save();
      doc.rect(doc.x - 10, doc.y - 10, doc.page.width - doc.page.margins.left - doc.page.margins.right + 20, 70).fillOpacity(0.03).fillAndStroke("#000000", "#000000");
      doc.fillOpacity(1).fillColor("black");
      doc.fontSize(18).font("Helvetica-Bold").text(clinicName, { align: "center" });
      doc.moveDown(0.2);
      doc.fontSize(11).font("Helvetica").text(`${docName}${qualification ? ", " + qualification : ""}`, { align: "center" });
      if (address) doc.fontSize(9).text(address, { align: "center" });
      const contactLine = [phone && `Ph: ${phone}`, reg && reg].filter(Boolean).join("   ");
      if (contactLine) doc.fontSize(9).text(contactLine, { align: "center" });
      doc.restore();
      doc.moveDown(2);

      // Horizontal separator
      doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).lineWidth(0.5).stroke();

      // Patient details row
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica-Bold").text("Patient Details", { continued: false });
      doc.moveUp();
      doc.fontSize(10).font("Helvetica").text(`Date: ${dateStr}`, { align: "right" });
      doc.moveDown(0.6);

      const { fullName = "-", email = "-", gender = "-", dateOfBirth = "-" , height = "-", weight = "-" } = patientSnapshot || {};

      // Two-column patient info
      const leftX = doc.x;
      const midX = doc.page.width / 2;
      doc.fontSize(10).font("Helvetica").text(`Name: ${fullName}`, leftX, doc.y, { continued: false });
   doc.text(`Age: ${patientSnapshot.age || "-"} years`, { align: "left" });
      doc.moveDown(0.2);
      doc.text(`Gender: ${gender || "-"}`);
      doc.moveDown(0.2);
      doc.text(`Email: ${email}`);
      doc.moveDown(0.4);

      // Symptoms and Diagnosis
      if (prescriptionData.symptoms?.length) {
        doc.fontSize(11).font("Helvetica-Bold").text("Symptoms:");
        doc.fontSize(10).font("Helvetica").text(prescriptionData.symptoms.join(", "), { indent: 10, continued: false });
        doc.moveDown(0.3);
      }

      doc.fontSize(11).font("Helvetica-Bold").text("Diagnosis:");
      doc.fontSize(10).font("Helvetica").text(prescriptionData.diagnosis || "-", { indent: 10 });
      doc.moveDown(0.4);

      // Medicines table-like list
      if (prescriptionData.medicines?.length) {
        doc.fontSize(11).font("Helvetica-Bold").text("Medicines:");
        doc.moveDown(0.2);

        prescriptionData.medicines.forEach((m, idx) => {
          const times = [
            m.times?.morning ? "M" : "",
            m.times?.midday ? "Mid" : "",
            m.times?.night ? "N" : ""
          ].filter(Boolean).join(", ");
          const line = `${idx + 1}. ${m.name || "-"} — ${m.dosage || "-"} — ${times || "-"} — ${m.durationDays || "-"} day(s) ${m.instruction ? ` — ${m.instruction}` : ""}`;
          doc.fontSize(10).font("Helvetica").text(line, { indent: 10 });
        });

        doc.moveDown(0.4);
      }

      // Lab tests & Notes
      if (prescriptionData.labTests?.length) {
        doc.fontSize(11).font("Helvetica-Bold").text("Recommended Tests:");
        doc.fontSize(10).font("Helvetica").text(prescriptionData.labTests.join(", "), { indent: 10 });
        doc.moveDown(0.3);
      }

      if (prescriptionData.notes) {
        doc.fontSize(11).font("Helvetica-Bold").text("Additional Notes:");
        doc.fontSize(10).font("Helvetica").text(prescriptionData.notes, { indent: 10 });
        doc.moveDown(0.4);
      }

      // Follow-up date if provided
      if (prescriptionData.followUpDate) {
        doc.fontSize(10).font("Helvetica-Bold").text(`Follow-up: ${prescriptionData.followUpDate}`, { indent: 10 });
        doc.moveDown(0.4);
      }

     // ================= SIGNATURE =================
const bottomY = doc.page.height - doc.page.margins.bottom - 120;
let signPath = null;

// priority: local path
if (doctor.signaturePath) {
  signPath = doctor.signaturePath;
}

// fallback: convert URL → local path
else if (doctor.signatureUrl) {
  signPath = path.resolve(
    doctor.signatureUrl.replace(/^https?:\/\/[^/]+\//, "")
  );
}

// DEBUG (VERY IMPORTANT – keep once)
console.log("Signature debug:", {
  signaturePath: doctor.signaturePath,
  signatureUrl: doctor.signatureUrl,
  resolvedPath: signPath,
  exists: signPath ? fs.existsSync(signPath) : false
});

if (signPath && fs.existsSync(signPath)) {
  const imgX = doc.page.width - doc.page.margins.right - 140;

  doc.image(signPath, imgX, bottomY, { width: 140 });

  doc.fontSize(9).text(
    `Dr. ${doctor.name}`,
    imgX,
    bottomY + 65,
    { width: 140, align: "center" }
  );
} else {
  // fallback text signature
  doc.fontSize(10).text(`Dr. ${doctor.name}`, { align: "right" });
  if (qualification) doc.fontSize(9).text(qualification, { align: "right" });
  if (reg) doc.fontSize(9).text(reg, { align: "right" });
}
// ================= END SIGNATURE =================


      // Footer small print
      doc.moveTo(doc.x, doc.page.height - doc.page.margins.bottom - 40).lineTo(doc.page.width - doc.page.margins.right, doc.page.height - doc.page.margins.bottom - 40).strokeOpacity(0.05).stroke();
      doc.fontSize(8).font("Helvetica-Oblique").text(`Generated by MediCloud on ${now.toLocaleString()}`, doc.x, doc.page.height - doc.page.margins.bottom - 30, { align: "left" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * New endpoint: POST /api/prescriptions/preview
 * Body: same as create (doctorId, patientEmail, symptoms, diagnosis, medicines, labTests, notes, followUpDate?)
 * Returns: application/pdf (arraybuffer) — the generated PDF buffer (NO DB save, NO GridFS upload)
 */
export const previewPrescription = async (req, res) => {
  try {
    const {
      doctorId,
      patientEmail,
      symptoms = [],
      diagnosis = "",
      medicines = [],
      labTests = [],
      notes = "",
      followUpDate = ""
    } = req.body || {};

    if (!doctorId || !patientEmail) return res.status(400).json({ error: "doctorId and patientEmail required" });

    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const patient = await Patient.findOne({ email: (patientEmail || "").toLowerCase() }).lean();
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const patientSnapshot = {
      fullName: patient.fullName || "",
      email: patient.email || "",
      gender: patient.gender || "",
      dateOfBirth: patient.dateOfBirth || "",
      age: calculateAge(patient.dateOfBirth),
      height: patient.height || "",
      weight: patient.weight || ""
    };

    const pdfBuffer = await createPrescriptionPDFBuffer({
      doctor,
      patientSnapshot,
      prescriptionData: {
        symptoms,
        diagnosis,
        medicines,
        labTests,
        notes,
        followUpDate
      }
    });

    // Return PDF bytes directly (frontend will show it in iframe)
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
      "Content-Disposition": "inline; filename=prescription_preview.pdf"
    });
    return res.send(pdfBuffer);

  } catch (err) {
    console.error("previewPrescription error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
// GET /api/prescriptions/patient?email=...
export const getPatientByEmail = async (req, res) => {
  try {
    const email = (req.query.email || "").toLowerCase();
    if (!email) return res.status(400).json({ message: "email required" });

    const patient = await Patient.findOne({ email }).lean();
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    return res.json(patient);
  } catch (err) {
    console.error("getPatientByEmail error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/prescriptions/create
 * Body JSON:
 * {
 *   doctorId: "...",
 *   patientEmail: "...",
 *   symptoms: [...],
 *   diagnosis: "...",
 *   medicines: [...],
 *   labTests: [...],
 *   notes: "..."
 * }
 */
export const createPrescription = async (req, res) => {
  try {
    // log incoming body for easier debugging
    console.log("createPrescription - req.body:", req.body);

    const {
      doctorId,
      patientEmail,
      symptoms = [],
      diagnosis = "",
      medicines = [],
      labTests = [],
      notes = ""
    } = req.body || {};

    if (!doctorId || !patientEmail) {
      return res.status(400).json({ error: "doctorId and patientEmail required" });
    }

    // fetch doctor and patient (lean)
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const patient = await Patient.findOne({ email: (patientEmail || "").toLowerCase() }).lean();
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // snapshot patient
    const patientSnapshot = {
      fullName: patient.fullName || "",
      email: patient.email || "",
      gender: patient.gender || "",
      dateOfBirth: patient.dateOfBirth || "",
      age: calculateAge(patient.dateOfBirth),
      height: patient.height || "",
      weight: patient.weight || ""
    };

    // create prescription doc with the exact field name expected by schema: doctorId
    const prescription = await Prescription.create({
      doctorId: doctorId,
      patientEmail: (patientEmail || "").toLowerCase(),
      patientSnapshot,
      symptoms,
      diagnosis,
      medicines,
      labTests,
      notes,
      createdAt: new Date()
    });

    const prescriptionId = prescription._id.toString();

    // generate PDF buffer
    const pdfBuffer = await createPrescriptionPDFBuffer({
      doctor,
      patientSnapshot,
      prescriptionData: {
        symptoms,
        diagnosis,
        medicines,
        labTests,
        notes
      }
    });

    // upload to GridFS bucket "prescriptions"
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "prescriptions" });
    const filename = `prescription-${prescriptionId}.pdf`;
    const uploadStream = bucket.openUploadStream(filename, { contentType: "application/pdf" });

    uploadStream.end(pdfBuffer);

   uploadStream.on("finish", async () => {
  try {
    const fileId = uploadStream.id.toString(); // ✔ SAFE & ALWAYS AVAILABLE

    await Prescription.findByIdAndUpdate(prescriptionId, {
      gridFsFileId: fileId,
      filename
    });

    return res.json({
      success: true,
      prescriptionId,
      downloadUrl: `/api/prescriptions/download/${prescriptionId}`
    });

  } catch (err) {
    console.error("Error updating prescription after GridFS upload:", err);
    return res.status(500).json({ error: "Uploaded PDF but failed to update prescription record" });
  }
});

    uploadStream.on("error", (err) => {
      console.error("GridFS upload error:", err);
      return res.status(500).json({ error: "Failed to save PDF" });
    });

  } catch (err) {
    console.error("createPrescription error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// GET /api/prescriptions/download/:id
export const downloadPrescription = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id required" });

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "prescriptions" });

    // find file by filename convention
    const filename = `prescription-${id}.pdf`;
    const file = await mongoose.connection.db.collection("prescriptions.files").findOne({ filename });

    if (!file) return res.status(404).json({ error: "PDF not found" });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${filename}`
    });

    bucket.openDownloadStream(file._id).pipe(res);

  } catch (err) {
    console.error("downloadPrescription error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// GET /api/prescriptions/doctor/:doctorId
export const listPrescriptionsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const list = await Prescription.find({ doctorId }).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error("listPrescriptionsByDoctor error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/prescriptions/patient-list?email=...
export const listPrescriptionsByPatient = async (req, res) => {
  try {
    const email = (req.query.email || "").toLowerCase();
    const list = await Prescription.find({ patientEmail: email }).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error("listPrescriptionsByPatient error:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientEmail } = req.params;

    const prescriptions = await Prescription.find({
      "patientSnapshot.email": patientEmail
    })
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getRecentPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const prescriptions = await Prescription.find({ doctorId })
      .sort({ createdAt: -1 }) // latest first
      .limit(5);               // only 5 recent

    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent prescriptions" });
  }
};

// ===============================
// PATIENT ANALYTICS
// ===============================
export const getPatientAnalytics = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Patient email is required"
      });
    }

    const prescriptions = await Prescription.find({
      patientEmail: email
    })
      .sort({ createdAt: -1 })
      .populate("doctorId", "_id");

    const totalPrescriptions = prescriptions.length;

    const lastVisit =
      totalPrescriptions > 0 ? prescriptions[0].createdAt : null;

    const doctorsConsulted = new Set(
      prescriptions
        .filter(p => p.doctorId)
        .map(p => p.doctorId._id.toString())
    ).size;

    res.json({
      totalPrescriptions,
      lastVisit,
      doctorsConsulted
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
// ===============================
// PATIENT MEDICAL HISTORY
// ===============================
export const getPatientMedicalHistory = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Patient email is required"
      });
    }

    const prescriptions = await Prescription.find({
      patientEmail: email,
      diagnosis: { $ne: "" }
    }).sort({ createdAt: 1 }); // oldest first

    const historyMap = {};

    prescriptions.forEach(p => {
      const diagnosis = p.diagnosis;

      if (!historyMap[diagnosis]) {
        historyMap[diagnosis] = {
          diagnosis,
          firstDiagnosed: p.createdAt
        };
      }
    });

    const medicalHistory = Object.values(historyMap);

    res.json(medicalHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
