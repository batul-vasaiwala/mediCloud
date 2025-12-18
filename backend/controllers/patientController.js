import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerPatient = async (req, res) => {
  try {
    const {fullName, email, dateOfBirth, gender, password } = req.body;

    const exists = await Patient.findOne({ email });
    if (exists) return res.json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const patient = new Patient({
      fullName,
      email,
      dateOfBirth,
      gender,
      password: hashed,
    });

    await patient.save();

    res.json({ success: true, message: "Patient registered!", patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) return res.json({ error: "Patient not found" });

    const match = await bcrypt.compare(password, patient.password);
    if (!match) return res.json({ error: "Wrong password" });

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ success: true, token, patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("fullName gender dateOfBirth email updatedAt")
      .sort({ updatedAt: -1 });

    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};