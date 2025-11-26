import express from "express";
import { registerPatient, loginPatient } from "../controllers/patientController.js";

const router = express.Router();


// REGISTER
router.post("/register", registerPatient);

// LOGIN
router.post("/login", loginPatient);

export default router;
