const express = require("express");
const router = express.Router();
const adminContoller = require("../controllers/adminController");

router.get("/doctors", adminContoller.getdoctors);
router.put("/doctors/:id", adminContoller.editdoctors);
router.get("/frontdesk", adminContoller.getfrontdesks);
router.put("/staff/:id", adminContoller.editstaff);
router.get("/nurse", adminContoller.getnurses);
router.post("/verifypassword/:user_id", adminContoller.verifypassword);
router.post("/changepassword/:user_id", adminContoller.changepassword);

module.exports = router;
