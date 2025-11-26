import express from "express";
import multer from "multer";
import { registerDoctor, loginDoctor } from "../controllers/doctorController.js";

const router = express.Router();

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// REGISTER
router.post("/register", upload.single("signature"), registerDoctor);

// LOGIN
router.post("/login", loginDoctor);

export default router;
