import express from "express";
import Prescription from "../models/prescription.js";

const router = express.Router();

/* 1️⃣ TOTAL PRESCRIPTIONS */
router.get("/summary", async (req, res) => {
  const total = await Prescription.countDocuments();

  res.json({ total });
});

/* 2️⃣ DISEASE DISTRIBUTION */
router.get("/disease-distribution", async (req, res) => {
  const data = await Prescription.aggregate([
    { $group: { _id: "$diagnosis", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json(data);
});

/* 3️⃣ TOP DISEASE TREND (LINE GRAPH) */
router.get("/disease-trend", async (req, res) => {
  const data = await Prescription.aggregate([
    {
      $group: {
        _id: {
          diagnosis: "$diagnosis",
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.month": 1 } }
  ]);

  res.json(data);
});

/* 4️⃣ AGE GROUP */
router.get("/age-groups", async (req, res) => {
  const data = await Prescription.find(
    { "patientSnapshot.dateOfBirth": { $exists: true } },
    { "patientSnapshot.dateOfBirth": 1 }
  );

  res.json(data);
});

/* 5️⃣ GENDER */
router.get("/gender", async (req, res) => {
  const data = await Prescription.aggregate([
    { $group: { _id: "$patientSnapshot.gender", count: { $sum: 1 } } }
  ]);

  res.json(data);
});

/* 6️⃣ MEDICINE DISTRIBUTION */
router.get("/medicine-distribution", async (req, res) => {
  const data = await Prescription.aggregate([
    { $unwind: "$medicines" },
    {
      $group: {
        _id: "$medicines.name",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json(data);
});

export default router;
