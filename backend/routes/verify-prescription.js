import express from "express"
import multer from "multer"
import axios from "axios"
import FormData from "form-data"
import fs from "fs"

const router = express.Router()
const upload = multer({ dest: "uploads/" })

router.post(
  "/verify-prescription",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      const formData = new FormData()
      formData.append("file", fs.createReadStream(req.file.path))
      formData.append("doctor_id", "DR123")

      const flaskResponse = await axios.post(
        "http://127.0.0.1:6000/api/verify-prescription", // ✅ FIXED
        formData,
        {
          headers: formData.getHeaders()
        }
      )

      fs.unlinkSync(req.file.path)

      return res.json(flaskResponse.data)

    } catch (err) {
      console.error("AI error:", err.message)
      return res.status(500).json({
        error: "AI verification failed",
        details: err.response?.data || err.message
      })
    }
  }
)

export default router
