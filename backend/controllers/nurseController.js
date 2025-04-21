const db = require("../db");

const searchTests = async (req, res) => {
  const { query = "" } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT t_id AS id, test_name AS name
         FROM tests
         WHERE LOWER(test_name) LIKE LOWER(?)`,
      [`%${query}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const patienttests = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT 
        c.c_id,
        c.p_id,
        p.name AS patient_name,
        c.d_id,
        u.name AS doctor_name,
        c.t_id,
        t.test_name,
        c.t_result,
        CASE 
          WHEN c.t_result IS NULL THEN 'pending'
          ELSE 'completed'
        END AS status
      FROM conducted c
      JOIN patients p ON c.p_id = p.p_id
      JOIN doctors d ON c.d_id = d.d_id
      JOIN users u ON d.user_id = u.user_id
      JOIN tests t ON c.t_id = t.t_id`
    );

    res.json(results);
  } catch (error) {
    console.error("Error fetching conducted tests:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const submittest = async (req, res) => {
  const { id } = req.params;
  const { t_date, t_result } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE conducted
       SET t_date = ?, t_result = ?
       WHERE c_id = ?`,
      [t_date, t_result, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Test entry not found" });
    }

    res.json({ message: "Test result submitted successfully" });
  } catch (error) {
    console.error("Error updating test result:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { patienttests, submittest };
