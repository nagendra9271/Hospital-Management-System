const express = require("express");
const router = express.Router();
const PatientController = require("../controllers/PatientController");

router.post("/add", PatientController.addPatient);
router.get("/", PatientController.fetchPatients);
router.get("/search", PatientController.search);
module.exports = router;
