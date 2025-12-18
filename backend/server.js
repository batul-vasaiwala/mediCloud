// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

app.use(cors());
// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded (just in case)
app.use(express.urlencoded({ extended: true }));

// serve signature images
app.use("/uploads", express.static("uploads"));

//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// doctor routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);

// prescriptions route
app.use("/api/prescriptions", prescriptionRoutes);

app.use("/api/patients", patientRoutes);


app.use("/api/doctor/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
