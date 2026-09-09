const db = require('../config/db');

// Create new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { doctor_id, appointment_date, appointment_time } = req.body;
        const user_id = req.user.id; 

        if (!doctor_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if doctor exists
        const [doctorExists] = await db.query('SELECT id FROM doctors WHERE id = ?', [doctor_id]);
        if (doctorExists.length === 0) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Insert appointment
        const [result] = await db.query(
            'INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, "pending")',
            [user_id, doctor_id, appointment_date, appointment_time]
        );

        res.status(201).json({
            message: "Appointment created successfully",
            appointmentId: result.insertId
        });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all appointments for logged-in user
exports.getUserAppointments = async (req, res) => {
    try {
        const user_id = req.user.id;
        const query = `
            SELECT a.*, d.name AS doctor_name, d.specialization 
            FROM appointments a 
            JOIN doctors d ON a.doctor_id = d.id 
            WHERE a.user_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `;
        const [appointments] = await db.query(query, [user_id]);
        
        res.json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update an appointment (e.g. reschedule)
exports.updateAppointment = async (req, res) => {
    try {
        const { appointment_date, appointment_time, status } = req.body;
        const appointment_id = req.params.id;
        const user_id = req.user.id;

        // Verify the appointment belongs to the user
        const [appointment] = await db.query('SELECT user_id FROM appointments WHERE id = ?', [appointment_id]);
        
        if (appointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        
        if (appointment[0].user_id !== user_id) {
            return res.status(403).json({ message: "Unauthorized to update this appointment" });
        }

        let updateQuery = 'UPDATE appointments SET ';
        const updateValues = [];
        
        if (appointment_date) { updateQuery += 'appointment_date = ?, '; updateValues.push(appointment_date); }
        if (appointment_time) { updateQuery += 'appointment_time = ?, '; updateValues.push(appointment_time); }
        if (status) { updateQuery += 'status = ?, '; updateValues.push(status); }

        updateQuery = updateQuery.slice(0, -2); // Remove last comma
        updateQuery += ' WHERE id = ?';
        updateValues.push(appointment_id);

        await db.query(updateQuery, updateValues);

        res.json({ message: "Appointment updated successfully" });

    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment_id = req.params.id;
        const user_id = req.user.id;

        const [appointment] = await db.query('SELECT user_id FROM appointments WHERE id = ?', [appointment_id]);
        
        if (appointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment[0].user_id !== user_id) {
            return res.status(403).json({ message: "Unauthorized to delete this appointment" });
        }

        await db.query('DELETE FROM appointments WHERE id = ?', [appointment_id]);

        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
