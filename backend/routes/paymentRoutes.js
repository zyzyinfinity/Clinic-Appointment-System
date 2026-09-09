const express = require('express');
const router = express.Router();
const { createPayment, getUserPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// @route POST /api/payments
// @desc Process a mock payment
router.post('/', createPayment);

// @route GET /api/payments
// @desc Get all payments for a user
router.get('/', getUserPayments);

module.exports = router;
