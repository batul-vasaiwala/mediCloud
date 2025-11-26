import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  gender: String,
  dateOfBirth: String,
  password: String,
});

export default mongoose.model("Patient", PatientSchema);
