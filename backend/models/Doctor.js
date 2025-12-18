import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  specialization: String,
  license: String,
  password: String,
  signatureUrl: String,
  signaturePath: {
  type: String
},
});

export default mongoose.model("Doctor", DoctorSchema);
