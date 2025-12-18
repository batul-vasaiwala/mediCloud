import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
// ------------------------------------
// REGISTER DOCTOR
// ------------------------------------
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, phone, specialization, license, password } = req.body;

    // Absolute local path (for PDFKit)
    const signaturePath = path.resolve(req.file.path);

    // URL (for frontend display)
    const cleanPath = req.file.path.replace(/\\/g, "/");
    const signatureUrl = `${req.protocol}://${req.get("host")}/${cleanPath}`;
    // Check if email exists
    const exists = await Doctor.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor
    const doctor = new Doctor({
      name,
      email,
      phone,
      specialization,
      license,
      password: hashedPassword,
      signaturePath,
      signatureUrl,
    });

    await doctor.save();
const token = jwt.sign(
      { doctorId: doctor._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

res.json({
  success: true,
  token,
  doctor: {
    _id: doctor._id,
    name: doctor.name,
    email: doctor.email,
    phone: doctor.phone,
    specialization: doctor.specialization,
    license: doctor.license,
    signatureUrl: doctor.signatureUrl
  }
});



  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------------
// LOGIN DOCTOR
// ------------------------------------
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor)
      return res.status(404).json({ error: "Doctor not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(401).json({ error: "Incorrect password" });

    // Generate JWT
    const token = jwt.sign(
      { doctorId: doctor._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send safe doctor info
    res.json({
      success: true,
      token,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        phone: doctor.phone,
        license: doctor.license,
        signatureUrl: doctor.signatureUrl,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
