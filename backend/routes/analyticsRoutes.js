import express from "express";
import { getDoctorAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/:doctorId", getDoctorAnalytics);

export default router;
