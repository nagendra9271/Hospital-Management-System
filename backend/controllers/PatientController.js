const db = require("../db");

exports.addPatient = async (req, res) => {
  const { Pname, Page, gender, bloodgroup, Paddress, Pphone, email } = req.body;

  try {
    // Basic check if email or phone already exists
    const [existing] = await db.query(
      "SELECT * FROM Patients WHERE email = ? AND name = ?",
      [email, Pname]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Patient already registered" });
    }

    await db.query(
      `INSERT INTO Patients (name, age, gender, bloodgroup, address, phoneno, email)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Pname, Page, gender, bloodgroup, Paddress, Pphone, email]
    );

    res.status(201).json({ message: "Patient registered successfully" });
  } catch (err) {
    console.error("Register Patient Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.fetchPatients = async (req, res) => {
  const search = req.query.search || "";

  try {
    const [rows] = await db.query(
      `SELECT 
         p_id AS id,
         name,
         age,
         gender,
         email,
         bloodgroup,
         Phoneno AS phone,
         address,
         CreatedAt
       FROM Patients
       WHERE name LIKE ?
          OR email LIKE ?
          OR bloodgroup LIKE ?
          OR Phoneno LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.search = async (req, res) => {
  const query = req.query.query || "";
  try {
    const [rows] = await db.query(
      "SELECT p_id AS id, CONCAT(name, ' (', age, ')') AS name FROM patients WHERE name LIKE ?",
      [`%${query}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error("Search Patient Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
