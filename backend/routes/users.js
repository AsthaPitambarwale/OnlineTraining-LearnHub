const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET USERS */
router.get("/", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        users.*,
        COUNT(enrollments.courseId) AS courses
      FROM users
      LEFT JOIN enrollments
        ON users.id = enrollments.userId
      GROUP BY users.id
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE USER */
router.post("/", (req, res) => {
  const { name, email, password, role } = req.body;

  const id = Date.now().toString();

  try {
    db.prepare(
      "INSERT INTO users (id,name,email,password,role) VALUES(?,?,?,?,?)"
    ).run(id, name, email, password, role || "student");

    res.json({ id, name, email, role: role || "student" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE USER */
router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM users WHERE id=?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;