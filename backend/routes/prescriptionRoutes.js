import express from "express";
import {
  getPatientByEmail,
  previewPrescription,
  createPrescription,
  downloadPrescription,
  listPrescriptionsByDoctor,
  listPrescriptionsByPatient,
  getPrescriptionsByPatient,
  getRecentPrescriptionsByDoctor,
  getPatientAnalytics,
  getPatientMedicalHistory
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.get("/patient", getPatientByEmail); // ?email=...
router.post("/preview", previewPrescription);           // <-- new
router.post("/create", createPrescription);    
router.get("/download/:id", downloadPrescription); // stream PDF by prescription id
router.get("/doctor/:doctorId", listPrescriptionsByDoctor);
router.get("/patient-list", listPrescriptionsByPatient); // ?email=...
router.get( "/patient/:patientEmail",getPrescriptionsByPatient
);
router.get("/recent/:doctorId", getRecentPrescriptionsByDoctor);
router.get(
  "/patient-analytics",
  getPatientAnalytics
);
router.get(
  "/patient-medical-history",
  getPatientMedicalHistory
);



export default router;
