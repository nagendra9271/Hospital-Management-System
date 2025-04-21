const db = require("../db");

// Signup
const signup = async (req, res) => {
  const { name, email, password, phone_no, role, specialization } = req.body;

  try {
    // Check for existing email
    const [emailExists] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (emailExists.length > 0)
      return res.status(400).json({ error: "Email already registered" });

    // Check for existing phone number
    const [phoneExists] = await db.query(
      "SELECT * FROM users WHERE phone_no = ?",
      [phone_no]
    );
    if (phoneExists.length > 0)
      return res.status(400).json({ error: "Phone number already registered" });

    // Insert user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, phone_no, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, phone_no, role]
    );

    const user_id = result.insertId;

    // If Doctor, insert into doctors table
    if (role === "Doctor") {
      await db.query(
        "INSERT INTO doctors (user_id, specialization) VALUES (?, ?)",
        [user_id, specialization]
      );
    }

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?",
      [email, password, role]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = results[0];
    res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone_no: user.phone_no,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchUsers = async (req, res) => {
  const { name = "", role } = req.query;
  console.log(name, role);
  try {
    var users;
    if (role) {
      [users] = await db.query(
        "SELECT * FROM users WHERE name LIKE ? AND role = ?",
        [`%${name}%`, role]
      );
    } else {
      [users] = await db.query("SELECT * FROM users WHERE name LIKE ? ", [
        `%${name}%`,
      ]);
    }

    res.status(200).json({
      users,
      message: "Users fetched successfully",
    });
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Deleting User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  signup,
  login,
  fetchUsers,
  deleteUser,
};
