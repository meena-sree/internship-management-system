const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offer.controller");
const { verifyToken, isStudent, isCompany } = require("../middleware/auth.middleware");

// Company sends offer
router.post("/", verifyToken, isCompany, offerController.createOffer);

// Student sees offers
router.get("/student", verifyToken, isStudent, offerController.getStudentOffers);

// Company sees all offers they made
router.get("/company", verifyToken, isCompany, offerController.getCompanyOffers);

// Student updates status (accept/reject)
router.put("/:id", verifyToken, isStudent, offerController.updateOfferStatus);

module.exports = router;
