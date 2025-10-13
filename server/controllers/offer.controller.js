const Offer = require("../models/offer.model");
const Application = require("../models/application.model");
const Internship = require("../models/internship.model");

exports.createOffer = async (req, res) => {
  try {
    const { application_id } = req.body;
    const company_id = req.user.id;

    const app = await Application.findById(application_id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const internship = await Internship.findById(app.internship_id);
    if (internship.company_id !== company_id) {
      return res.status(403).json({ message: "Unauthorized to create offer for this application" });
    }

    await Offer.create(application_id);
    res.status(201).json({ message: "Offer sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating offer", error: err.message });
  }
};

exports.getStudentOffers = async (req, res) => {
  try {
    const student_id = req.user.id;
    const offers = await Offer.findByStudent(student_id);
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching offers", error: err.message });
  }
};

exports.getCompanyOffers = async (req, res) => {
  try {
    const company_id = req.user.id;
    const offers = await Offer.findByCompany(company_id);
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching offers", error: err.message });
  }
};

exports.updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params; // offer_id
    const { status } = req.body; // accepted/rejected

    await Offer.updateStatus(id, status);
    res.json({ message: `Offer status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Error updating offer", error: err.message });
  }
};
