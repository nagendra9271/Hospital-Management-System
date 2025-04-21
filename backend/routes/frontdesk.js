const express = require("express");
const router = express.Router();
const frontDeskController = require("../controllers/frontdeskController");

router.get("/rooms/available", frontDeskController.getAvailableRooms);
router.get(
  "/admissions/recommendations",
  frontDeskController.getRecommendations
);
router.post("/admitpatient", frontDeskController.admitpatient);
router.get("/availablepatients", frontDeskController.availablepateints);
router.get("/dischargepatient/:adm_id", frontDeskController.dischargepatient);
router.get("/rooms", frontDeskController.manageroom);

module.exports = router;
