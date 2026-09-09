const db = require('../config/db');

// Create payment record
exports.createPayment = async (req, res) => {
    try {
        const { appointment_id, amount } = req.body;
        const user_id = req.user.id;

        if (!appointment_id || !amount) {
            return res.status(400).json({ message: "Appointment ID and amount are required" });
        }

        // Verify the appointment belongs to the user
        const [appointment] = await db.query('SELECT id FROM appointments WHERE id = ? AND user_id = ?', [appointment_id, user_id]);
        
        if (appointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found or unauthorized" });
        }

        // Check if payment already exists
        const [existingPayment] = await db.query('SELECT id FROM payments WHERE appointment_id = ?', [appointment_id]);
        if (existingPayment.length > 0) {
            return res.status(400).json({ message: "Payment for this appointment already exists" });
        }

        // Insert mock payment (simulating a successful payment)
        const [result] = await db.query(
            'INSERT INTO payments (appointment_id, amount, payment_status) VALUES (?, ?, "completed")',
            [appointment_id, amount]
        );

        // Update appointment status to confirmed
        await db.query('UPDATE appointments SET status = "confirmed" WHERE id = ?', [appointment_id]);

        res.status(201).json({
            message: "Payment successful and appointment confirmed",
            paymentId: result.insertId
        });
    } catch (error) {
        console.error("Error recording payment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all user payments
exports.getUserPayments = async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const query = `
            SELECT p.*, a.appointment_date 
            FROM payments p 
            JOIN appointments a ON p.appointment_id = a.id 
            WHERE a.user_id = ?
            ORDER BY p.payment_date DESC
        `;
        const [payments] = await db.query(query, [user_id]);

        res.json({ payments });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
