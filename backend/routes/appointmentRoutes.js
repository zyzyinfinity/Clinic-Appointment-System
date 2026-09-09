const express = require('express');
const router = express.Router();
const { createAppointment, getUserAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Ensure all appointment routes are protected
router.use(protect);

// @route POST /api/appointments
// @desc Create a new appointment
router.post('/', createAppointment);

// @route GET /api/appointments
// @desc Get all appointments for logged-in user
router.get('/', getUserAppointments);

// @route PUT /api/appointments/:id
// @desc Update an appointment
router.put('/:id', updateAppointment);

// @route DELETE /api/appointments/:id
// @desc Delete an appointment
router.delete('/:id', deleteAppointment);

module.exports = router;
