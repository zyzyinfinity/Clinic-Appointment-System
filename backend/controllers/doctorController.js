const db = require('../config/db');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT * FROM doctors');
        res.json({ doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
        
        if (doctors.length === 0) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.json({ doctor: doctors[0] });
    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
