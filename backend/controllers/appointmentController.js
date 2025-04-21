const db = require("../db");

const submitAppointments = async (req, res) => {
  const {
    patientId,
    doctorId,
    date,
    priority,
    symptoms,
    status = "Scheduled",
  } = req.body;

  try {
    const [appointment] = await db.query(
      `SELECT p_id FROM appointments WHERE p_id = ? AND d_id = ? AND status = 'Scheduled'`,
      [patientId, doctorId]
    );
    if (appointment.length > 0) {
      return res
        .status(400)
        .json({ error: "Appointment already booked for this patient" });
    }

    const [result] = await db.query(
      `INSERT INTO appointments 
      (p_id, d_id, a_date, priority, status, symptoms) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [patientId, doctorId, date, priority, status, symptoms]
    );

    res.status(201).json({
      message: "Appointment scheduled successfully",
      appointmentId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting appointment:", error);
    res.status(500).json({ error: "Failed to schedule appointment" });
  }
};

module.exports = { submitAppointments };
