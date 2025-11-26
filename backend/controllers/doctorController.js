import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerDoctor = async (req, res) => {
  try {
    const { name, email, phone, specialization, license, password } = req.body;

    const exists = await Doctor.findOne({ email });
    if (exists) return res.json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      email,
      phone,
      specialization,
      license,
      password: hashed,
      signatureUrl: req.file ? req.file.path : null,
    });

    await doctor.save();

    res.json({ success: true, message: "Doctor registered!", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.json({ error: "Doctor not found" });

    const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.json({ error: "Wrong password" });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ success: true, token, doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
