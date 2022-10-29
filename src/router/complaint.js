const express = require("express");
const router = express.Router();
const { complaintController } = require("../controller");
const { uploadImage } = require("../helper");
const { complaintAccess } = require("../middleware");

router.post(
  "/",
  uploadImage.imageUpload.fields([
    { name: "panCard", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  complaintController.addComplaint
);

router.delete("/:id", complaintController.deleteComplaint);

router.get(
  "/",
  complaintAccess.verifyComplaintAccess,
  complaintController.allComplaints
);

router.get("/myComplaints", complaintController.getComplaint);

router.put(
  "/",
  complaintAccess.verifyComplaintAccess,
  complaintController.statusUpdate
);

module.exports = router;
