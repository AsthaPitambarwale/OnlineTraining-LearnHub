const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET USER ENROLLMENTS */
router.get("/:userId", (req, res) => {
  try {
    const rows = db
      .prepare("SELECT userId, courseId FROM enrollments WHERE userId=?")
      .all(req.params.userId);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE ENROLLMENT */
router.post("/", (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: "Missing enrollment data" });
  }

  try {
    db.prepare(
      "INSERT OR IGNORE INTO enrollments (userId,courseId) VALUES(?,?)"
    ).run(userId, courseId);

    res.json({ success: true, userId, courseId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;