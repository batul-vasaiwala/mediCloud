import express from "express";
import { registerPatient, loginPatient,updatePatient } from "../controllers/patientController.js";
import { getAllPatients } from "../controllers/patientController.js";
const router = express.Router();


// REGISTER
router.post("/register", registerPatient);

// LOGIN
router.post("/login", loginPatient);

router.get("/", getAllPatients);

router.put("/patients/:id", updatePatient)

export default router;
