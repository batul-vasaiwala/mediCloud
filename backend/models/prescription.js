import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  times: { morning: Boolean, midday: Boolean, night: Boolean },
  instruction: String, // "after food" etc.
  durationDays: Number
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientEmail: { type: String, required: true },

  // snapshot of patient data at time of prescription
  patientSnapshot: {
    fullName: String,
    email: String,
    gender: String,
    dateOfBirth: String,
    height: String,
    weight: String,
    // ...any other patient fields
  },

  symptoms: [String],
  diagnosis: String,
  medicines: [MedicineSchema],
  labTests: [String],
  notes: String,

  gridFsFileId: String,     // ObjectId string of GridFS file
  filename: String,        // friendly filename
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Prescription", PrescriptionSchema);
