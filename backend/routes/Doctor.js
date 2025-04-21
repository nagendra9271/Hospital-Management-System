const express = require("express");
const router = express.Router();
const DoctorController = require("../controllers/DoctorController");

router.get("/", DoctorController.fetchDoctors);
router.get("/search", DoctorController.search);
router.get("/:id", DoctorController.getDoctorDetails);
router.get("/:id/patientlist", DoctorController.patientlist);
router.post("/:id/treatment", DoctorController.treatment);
router.get("/:id/appointments", DoctorController.getDoctorAppointmentsSummary);
router.patch("/:id/status", DoctorController.changeAppointmentStatus);
router.get(
  "/:id/patienthistory/:patientId",
  DoctorController.getpatientdetails
);
router.get("/search/test", DoctorController.searchtest);
router.post("/:id/conducttest", DoctorController.conducttest);
router.get("/:id/getresults", DoctorController.getresults);
router.patch(
  "/:d_id/:p_id/admitpatient",
  DoctorController.updatePatientAdmissionStatus
);
router.post("/addtest", DoctorController.addtest);
module.exports = router;
