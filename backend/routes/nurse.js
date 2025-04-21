const express = require("express");
const router = express.Router();
const nurseController = require("../controllers/nurseController");

router.get("/testresults", nurseController.patienttests);
router.post("/submittest/:id", nurseController.submittest);

module.exports = router;
