const db = require("../db");

const getdoctors = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        d.d_id,
        u.user_id as user_id,
        u.name,
        u.email,
        u.phone_no,
        u.password,
        u.role,
        d.specialization,
        d.degree,
        d.experience
       FROM doctors d
       JOIN users u ON u.user_id = d.user_id
       ORDER BY u.name ASC`
    );

    // Transform data to match frontend expectations
    const doctors = rows.map((row) => ({
      ...row,
      // Ensure all fields expected by the UI are present
      phone_no: row.phone_no || null, // Handle potential NULL values
      experience: row.experience || 0, // Default to 0 if NULL
      specialization: row.specialization || "General", // Default specialization
    }));

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    res.status(500).json({
      message: "Failed to fetch Doctors List",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// edit doctors
const editdoctors = async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, specialization, degree, experience } = req.body;

  try {
    const [phoneExists] = await db.query(
      "SELECT * FROM users WHERE phone_no = ?",
      [phone]
    );
    if (
      phoneExists.length > 0 &&
      parseInt(phoneExists[0].user_id) !== parseInt(userId)
    )
      return res.status(400).json({ error: "Phone number already registered" });
    // Update users table
    await db.query(
      "UPDATE users SET name = ?, email = ?, phone_no = ? WHERE user_id = ?",
      [name, email, phone, userId]
    );

    const updatedDegree = degree || null;
    const updatedExperience = experience || null;

    await db.query(
      "UPDATE doctors SET specialization = ?, degree = ?, experience = ? WHERE user_id = ?",
      [specialization, updatedDegree, updatedExperience, userId]
    );

    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ error: "Failed to update doctor" });
  }
};

// Get all front desk users
const getfrontdesks = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, name, email, phone_no,role,password
       FROM users 
       WHERE role = 'FrontDesk'`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching front desk users:", error);
    res.status(500).json({
      message: "Failed to fetch Front Desk List",
    });
  }
};

// Get all nurses
const getnurses = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, name, email, phone_no,role,password
       FROM users 
       WHERE role = 'Nurse'`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching nurses:", error);
    res.status(500).json({
      message: "Failed to fetch Nurses List",
    });
  }
};

//edit frontdesk,nurse
const editstaff = async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone } = req.body;

  try {
    const [phoneExists] = await db.query(
      "SELECT * FROM users WHERE phone_no = ?",
      [phone]
    );
    if (
      phoneExists.length > 0 &&
      parseInt(phoneExists[0].user_id) !== parseInt(userId)
    ) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    await db.query(
      "UPDATE users SET name = ?, email = ?, phone_no = ? WHERE user_id = ?",
      [name, email, phone, userId]
    );

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

const verifypassword = async (req, res) => {
  const { user_id } = req.params;
  const { old } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT password FROM users WHERE user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedPassword = rows[0].password;

    if (old !== storedPassword) {
      return res
        .status(400)
        .json({ error: "Please enter correct password to continue" });
    }

    return res.status(200).json({ message: "Password verified successfully" });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ error: "Failed to verify password" });
  }
};

const changepassword = async (req, res) => {
  const { user_id } = req.params;
  const { new: newPassword } = req.body;
  try {
    await db.query(`UPDATE users SET password = ? WHERE user_id = ?`, [
      newPassword,
      user_id,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
};

module.exports = {
  getdoctors,
  getfrontdesks,
  getnurses,
  editdoctors,
  editstaff,
  verifypassword,
  changepassword,
};
