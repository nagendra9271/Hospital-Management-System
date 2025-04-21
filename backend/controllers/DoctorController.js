const db = require("../db");
const getCurrentDate = require("../../utills/gettimestamp");

const getDoctorDetails = async (req, res) => {
  const { id: user_id } = req.params;

  try {
    const [cancelResult] = await db.query(`
      UPDATE appointments
      SET status = 'Cancelled'
      WHERE a_date < CURDATE()
      AND status NOT IN ('Cancelled','Completed')
    `);

    const [rows] = await db.query(
      `SELECT 
         d.d_id AS d_id,
         u.name AS name,
         u.email AS email,
         u.phone_no AS phone,
         d.specialization AS specialization,
         d.degree AS degree,
         d.experience AS experience
       FROM doctors d
       JOIN users u ON u.user_id = d.user_id
       WHERE u.user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      doctor: rows[0],
      message: `${cancelResult.affectedRows} outdated appointments canceled`,
    });
  } catch (error) {
    console.error(
      "Error fetching doctor details or canceling appointments:",
      error
    );
    res.status(500).json({ message: "Something went wrong" });
  }
};

const fetchDoctors = async (req, res) => {
  const search = req.query.search || "";
  try {
    const [rows] = await db.query(
      `SELECT 
         d.d_id AS id,
         u.name AS name,
         u.email AS email,
         u.phone_no AS phone,
         d.specialization AS specialization,
         d.degree AS degree,
         d.experience AS experience
       FROM doctors d
       JOIN users u ON u.user_id = d.user_id
       WHERE u.name LIKE ? 
         OR d.specialization LIKE ? 
         OR d.degree LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const search = async (req, res) => {
  const query = req.query.query || "";
  try {
    const [rows] = await db.query(
      `SELECT d.d_id AS id, CONCAT(u.name, ' , ', d.specialization) AS name 
        FROM doctors d
        JOIN users u ON u.user_id = d.user_id
        WHERE LOWER(u.name) LIKE LOWER(?)`,
      [`%${query}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const patientlist = async (req, res) => {
  const { id: d_id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT a.p_id AS PatientID, 
              p.name AS PatientName, 
              a.symptoms AS Symptoms, 
              a.a_date AS AppointmentDate, 
              a.status AS Status 
       FROM appointments a
       JOIN patients p ON a.p_id = p.p_id
       WHERE a.d_id = ?`,
      [d_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in Patients List" });
  }
};

const treatment = async (req, res) => {
  const appointmentId = req.params.id;
  const { prescription, description } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT d_id, p_id FROM appointments WHERE app_id = ?`,
      [appointmentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { d_id, p_id } = rows[0];

    const formattedPrescription = Array.isArray(prescription)
      ? prescription.join("\n")
      : prescription;

    const treatmentDate = new Date().toISOString().split("T")[0];

    const [result] = await db.query(
      `INSERT INTO treatment (d_id, p_id, prescription, description, treatment_date)
       VALUES (?, ?, ?, ?, ?)`,
      [d_id, p_id, formattedPrescription, description, treatmentDate]
    );

    await db.query(
      `UPDATE appointments SET status = 'completed' WHERE app_id = ?`,
      [appointmentId]
    );

    res.status(201).json({
      message: "Treatment added and appointment marked as completed",
      TreatmentId: result.insertId,
    });
  } catch (error) {
    console.error("Error during treatment processing:", error);
    res
      .status(500)
      .json({ message: "Something went wrong in Treatment in Doctors Panel" });
  }
};

const getDoctorAppointmentsSummary = async (req, res) => {
  const { id: d_id } = req.params;

  try {
    const [appointments] = await db.query(
      `SELECT a.app_id, a.a_date, a.priority, a.status, a.symptoms,
              p.p_id, p.name AS patient_name, p.age, p.gender
       FROM appointments a
       JOIN patients p ON a.p_id = p.p_id
       WHERE a.d_id = ? AND a.status = 'Scheduled'
       ORDER BY 
         a.a_date = CURDATE() DESC,        
         a.a_date DESC,                   
         FIELD(a.priority, 'High', 'Medium', 'Low') ASC`,
      [d_id]
    );

    const [[{ count: completedCount }]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM appointments 
       WHERE d_id = ? AND status = 'Completed'`,
      [d_id]
    );

    const [[{ count: scheduledCount }]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM appointments 
       WHERE d_id = ? AND status = 'Scheduled'`,
      [d_id]
    );

    const [[{ count: appointmentcount }]] = await db.query(
      `SELECT COUNT(*) AS count 
      FROM appointments
      WHERE d_id = ? AND a_date = CURDATE() AND Status NOT IN ('Completed', 'Cancelled')`,
      [d_id]
    );
    res.status(200).json({
      appointments,
      completed: completedCount,
      scheduled: scheduledCount,
      todayAppointments: appointmentcount,
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({
      message: "Failed to fetch doctor appointment summary",
    });
  }
};

const changeAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, admit } = req.body;

  const validStatuses = ["Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    // Get appointment details (needed for admission)
    const [appointmentRows] = await db.execute(
      "SELECT * FROM appointments WHERE app_id = ?",
      [id]
    );

    if (appointmentRows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const appointment = appointmentRows[0];

    // Update status
    await db.execute("UPDATE appointments SET status = ? WHERE app_id = ?", [
      status,
      id,
    ]);

    // If admitting, insert into admissions
    if (status === "Completed" && admit) {
      // Choose a room (e.g., first available) — this is a dummy placeholder
      const [roomRows] = await db.execute(
        "SELECT r_id FROM rooms WHERE status = 'Available' LIMIT 1"
      );

      if (roomRows.length === 0) {
        return res.status(400).json({ error: "No available rooms" });
      }

      const r_id = roomRows[0].r_id;

      // Insert into admissions
      await db.execute(
        "INSERT INTO admissions (p_id, d_id, r_id) VALUES (?, ?, ?)",
        [appointment.p_id, appointment.d_id, r_id]
      );

      // Optionally update room status
      await db.execute("UPDATE rooms SET status = 'Occupied' WHERE r_id = ?", [
        r_id,
      ]);
    }

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getpatientdetails = async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const [tests] = await db.query(
      `SELECT t.test_name, c.t_result, c.t_date
       FROM conducted c
       JOIN tests t ON c.t_id = t.t_id
       WHERE c.p_id = ? AND c.t_result IS NOT NULL`,
      [patientId]
    );

    const [treatments] = await db.query(
      `SELECT prescription, description, treatment_date
       FROM treatment
       WHERE p_id = ?`,
      [patientId]
    );
    console.log(tests);
    const historyData = {
      p_id: patientId,
      tests: tests.map((test) => ({
        test_name: test.test_name,
        t_result: test.t_result,
        t_date: test.t_date,
      })),
      treatments: treatments.map((treat) => ({
        treatment_date: treat.treatment_date,
        prescription: treat.prescription,
        description: treat.description,
      })),
    };
    // console.log("History Data: ", historyData);

    res.json(historyData);
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const conducttest = async (req, res) => {
  const appointmentId = req.params.id;
  const { tests: testIds } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT d_id, p_id FROM appointments WHERE app_id = ?`,
      [appointmentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { d_id, p_id } = rows[0];
    for (const t_id of testIds) {
      await db.query(
        `INSERT INTO conducted (d_id, p_id, t_id, t_date, t_result)
         VALUES (?, ?, ?, NULL, NULL)`,
        [d_id, p_id, t_id]
      );
    }

    await db.query(
      `UPDATE appointments SET status = 'completed' WHERE app_id = ?`,
      [appointmentId]
    );

    res.json({ message: "Tests successfully assigned." });
  } catch (error) {
    console.error("Error assigning tests:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const searchtest = async (req, res) => {
  const query = req.query.query || "";
  // console.log(req);
  try {
    const [rows] = await db.query(
      `SELECT t_id AS id, test_name 
       FROM tests 
       WHERE LOWER(test_name) LIKE LOWER(?)`,
      [`%${query}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching test names:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getresults = async (req, res) => {
  const { id: d_id } = req.params;
  if (!d_id) return res.status(400).json({ error: "Doctor ID is required" });
  try {
    const [rows] = await db.query(
      `
      SELECT 
        c.c_id,
        c.p_id,
        p.name,
        p.age,
        p.gender,
        t.test_name,
        c.t_date,
        c.t_result
      FROM conducted c
      JOIN patients p ON c.p_id = p.p_id
      JOIN tests t ON c.t_id = t.t_id
      WHERE c.d_id = ? AND c.is_checked = FALSE AND c.t_result IS NOT NULL
      ORDER BY c.p_id
    `,
      [d_id]
    );

    const patientMap = new Map();

    for (const row of rows) {
      const { c_id, p_id, name, age, gender, test_name, t_date, t_result } =
        row;

      if (!patientMap.has(p_id)) {
        patientMap.set(p_id, {
          p_id,
          name,
          age,
          gender,
          tests: [],
        });
      }

      patientMap.get(p_id).tests.push({
        c_id,
        test_name,
        t_date,
        t_result,
      });
    }

    const result = Array.from(patientMap.values());
    res.json(result);
  } catch (err) {
    console.error("Error fetching test results:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching test results." });
  }
};

const updatePatientAdmissionStatus = async (req, res) => {
  const { d_id, p_id } = req.params;
  const { admit } = req.body;

  if (!p_id || !d_id) {
    return res.status(400).json({ error: "Missing patient or doctor ID" });
  }

  if (typeof admit !== "boolean") {
    return res.status(400).json({ error: "Missing or invalid 'admit' value" });
  }

  try {
    const [pendingTests] = await db.query(
      `SELECT * FROM conducted WHERE p_id = ? AND t_result IS NULL`,
      [p_id]
    );

    if (pendingTests.length > 0) {
      return res.status(400).json({
        error: "All test results must be submitted before proceeding",
      });
    }
    await db.query(
      "UPDATE conducted SET is_admitted = ?, is_checked = TRUE WHERE p_id = ? AND d_id = ?",
      [admit, p_id, d_id]
    );

    res.status(200).json({
      message: admit
        ? "Marked for admission and checked"
        : "Marked as discharged and checked",
    });
  } catch (err) {
    console.error("Error updating admission/check status:", err);
    res.status(500).json({ error: "Server error while updating status" });
  }
};

const formatTestName = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const addtest = async (req, res) => {
  const { test_name } = req.body;
  const formattedName = formatTestName(test_name);

  try {
    const [existing] = await db.query(
      `SELECT test_name FROM tests WHERE LOWER(test_name) = LOWER(?)`,
      [formattedName]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Test already in table" });
    }

    await db.query(`INSERT INTO tests (test_name) VALUES (?)`, [formattedName]);

    res
      .status(201)
      .json({ message: "Test added successfully", test_name: formattedName });
  } catch (error) {
    console.error("Error in adding test:", error);
    res.status(500).json({ error: "Error in adding test" });
  }
};

module.exports = {
  search,
  fetchDoctors,
  patientlist,
  treatment,
  getDoctorDetails,
  getDoctorAppointmentsSummary,
  changeAppointmentStatus,
  getpatientdetails,
  searchtest,
  conducttest,
  getresults,
  updatePatientAdmissionStatus,
  addtest,
};
