import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  gender: String,
  dateOfBirth: String,
  height: Number,        // <-- add this
  weight: Number,        // <-- add this
  phone: String,         // optional
  address: String,       // optional
  password: String,
  
});

export default mongoose.model("Patient", PatientSchema);
