import Prescription from "../models/prescription.js";

export const getDoctorAnalytics = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // TODAY start
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // MONTH start
    const monthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // Fetch prescriptions
    const todayPrescriptions = await Prescription.find({
      doctorId,
      createdAt: { $gte: today }
    });

    const monthPrescriptions = await Prescription.find({
      doctorId,
      createdAt: { $gte: monthStart }
    });

    const allPrescriptions = await Prescription.find({ doctorId });

    // UNIQUE patient count (by email)
    const uniqueTodayPatients = new Set(
      todayPrescriptions.map(p => p.patientEmail)
    ).size;

    const uniqueMonthPatients = new Set(
      monthPrescriptions.map(p => p.patientEmail)
    ).size;

    const uniqueAllPatients = new Set(
      allPrescriptions.map(p => p.patientEmail)
    ).size;
const getMostCommonDiagnosis = (prescriptions) => {
  const count = {};

  prescriptions.forEach(p => {
    if (!p.diagnosis) return;

    const diag = p.diagnosis.trim().toLowerCase();

    count[diag] = (count[diag] || 0) + 1;
  });

  let mostCommon = "N/A";
  let max = 0;

  for (const diag in count) {
    if (count[diag] > max) {
      max = count[diag];
      mostCommon = diag;
    }
  }

  return mostCommon === "N/A"
    ? "N/A"
    : mostCommon.charAt(0).toUpperCase() + mostCommon.slice(1);
};

    res.json({
      today: {
        patientsAttended: uniqueTodayPatients,
        prescriptionsIssued: todayPrescriptions.length,
        aiVerification: todayPrescriptions.length
      },
      month: {
        totalPatients: uniqueMonthPatients,
        totalPrescriptions: monthPrescriptions.length,
       commonDiagnosis: getMostCommonDiagnosis(monthPrescriptions)

      },
      allTime: {
        totalPatients: uniqueAllPatients,
        lifetimePrescriptions: allPrescriptions.length,
        avgPatientsPerDay: (uniqueAllPatients / 30).toFixed(1)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Analytics error" });
  }
};
