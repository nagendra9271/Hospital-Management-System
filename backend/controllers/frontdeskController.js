const db = require("../db");

const getAvailableRooms = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT r_id, status FROM rooms WHERE status = 'Available' "
    );
    res.json(result); // result.rows will now contain only r_id and status fields
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          DISTINCT c.p_id,
          p.name, p.age, p.gender, p.bloodGroup, p.phoneno,
          c.d_id,
          d.specialization, d.degree, d.experience,
          u.name AS doctor_name
       FROM 
          conducted c
       JOIN patients p ON c.p_id = p.p_id
       JOIN doctors d ON c.d_id = d.d_id
       JOIN users u ON d.user_id = u.user_id
       WHERE 
          c.is_admitted = TRUE
          AND NOT EXISTS (
              SELECT 1 FROM admissions a 
              WHERE a.p_id = c.p_id AND a.status IN ('Admitted', 'Discharged')
          )`
    );

    const recommendations = rows.map((row) => ({
      id: row.p_id,
      patient: {
        p_id: row.p_id,
        name: row.name,
        age: row.age,
        gender: row.gender,
        bloodGroup: row.bloodGroup,
        phoneno: row.phoneno,
      },
      doctor: {
        d_id: row.d_id,
        name: row.doctor_name,
        specialization: row.specialization,
        degree: row.degree,
        experience: row.experience,
      },
      // No admitDate here since not selected
    }));

    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};

const admitpatient = async (req, res) => {
  const { p_id, d_id, r_id } = req.body;
  const r_id_int = parseInt(r_id, 10);

  try {
    const [existingAdmission] = await db.query(
      `SELECT * FROM admissions WHERE p_id = ? AND status = 'Admitted'`,
      [p_id]
    );

    if (existingAdmission.length > 0) {
      return res.status(400).json({ error: "Patient is already admitted" });
    }

    await db.query(
      `INSERT INTO admissions (p_id, d_id, r_id, status) VALUES (?, ?, ?, ?)`,
      [p_id, d_id, r_id_int, "Admitted"]
    );

    await db.query(
      `UPDATE rooms
      SET status = 'Occupied'
      WHERE r_id = ?`,
      [r_id_int]
    );

    res.status(200).json({ message: "Patient Admitted Successfully" });
  } catch (error) {
    console.error("Error admitting patient:", error);
    res.status(500).json({ error: "Failed to admit patient" });
  }
};

const availablepateints = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        a.adm_id AS admissionId, 
        p.name AS name, 
        p.age AS age, 
        a.r_id AS room, 
        a.admit_date AS admittedOn, 
        u.name AS doctor
      FROM admissions a
      JOIN patients p ON a.p_id = p.p_id
      JOIN doctors d ON a.d_id = d.d_id
      JOIN users u ON u.user_id = d.user_id
      WHERE a.status = 'Admitted'
    `);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching available patients:", error);
    res.status(500).json({ error: "Failed to fetch admitted patients" });
  }
};

const dischargepatient = async (req, res) => {
  const { adm_id } = req.params;

  try {
    const [[admission]] = await db.query(
      `SELECT r_id FROM admissions WHERE adm_id = ?`,
      [adm_id]
    );

    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    const roomId = admission.r_id;

    await db.query(
      `UPDATE admissions
       SET discharge_date = CURDATE(), status = 'Discharged'
       WHERE adm_id = ?`,
      [adm_id]
    );

    await db.query(
      `UPDATE rooms
       SET status = 'Available'
       WHERE r_id = ?`,
      [roomId]
    );

    res
      .status(200)
      .json({ message: "Patient discharged and room marked as available" });
  } catch (error) {
    console.error("Error discharging patient:", error);
    res.status(500).json({ error: "Failed to discharge patient" });
  }
};

const manageroom = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        a.r_id AS Room_no,
        a.p_id AS PatientID,
        p.name AS PatientName,
        p.age AS Age,
        u.name AS DoctorName
      FROM admissions a
      JOIN patients p ON p.p_id = a.p_id
      JOIN doctors d ON d.d_id = a.d_id
      JOIN users u ON u.user_id = d.user_id
      JOIN rooms r ON r.r_id = a.r_id
      WHERE r.status = 'Occupied'
    `);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching occupied room data:", error);
    res.status(500).json({ error: "Failed to fetch room data" });
  }
};

module.exports = {
  getAvailableRooms,
  getRecommendations,
  admitpatient,
  availablepateints,
  dischargepatient,
  manageroom,
};
