const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET PAYMENTS */
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM payments").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE PAYMENT */
router.post("/", (req, res) => {
  const p = req.body;

  if (!p.userId || !p.courseId || !p.amount) {
    return res.status(400).json({ error: "Missing payment data" });
  }

  const id = Date.now().toString();
  const date = new Date().toISOString().slice(0, 10);

  try {
    db.prepare(`
      INSERT INTO payments
      (id,userId,userName,courseId,courseTitle,amount,date,status)
      VALUES(?,?,?,?,?,?,?,?)
    `).run(
      id,
      p.userId,
      p.userName || "",
      p.courseId,
      p.courseTitle || "",
      p.amount,
      date,
      p.status || "completed"
    );

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;