const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');

// @route GET /api/doctors
// @desc Get all doctors
router.get('/', getAllDoctors);

// @route GET /api/doctors/:id
// @desc Get a single doctor
router.get('/:id', getDoctorById);

module.exports = router;
