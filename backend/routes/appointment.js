const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/book", appointmentController.submitAppointments);
module.exports = router;
