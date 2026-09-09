-- Local dev: uncomment the next two lines to create + select the database.
-- Hosted (Railway/etc.): skip them and import into the database the host gave you.
-- CREATE DATABASE IF NOT EXISTS clinic_appointment_system;
-- USE clinic_appointment_system;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    available_days VARCHAR(255) NOT NULL,
    available_time VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- Dummy Doctors
INSERT INTO doctors (name, specialization, available_days, available_time) VALUES
('Dr. Alice Smith', 'Cardiologist', 'Mon, Wed, Fri', '09:00 - 13:00'),
('Dr. Bob Jones', 'Dermatologist', 'Tue, Thu', '10:00 - 16:00'),
('Dr. Charlie Brown', 'General Practitioner', 'Mon-Fri', '08:00 - 17:00'),
('Dr. Diana Prince', 'Pediatrician', 'Mon, Wed, Fri', '14:00 - 18:00')
ON DUPLICATE KEY UPDATE name=name;
