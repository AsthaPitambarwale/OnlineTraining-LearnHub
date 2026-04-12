const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET COURSE PROGRESS */
router.get("/:userId/:courseId", (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const row = db
      .prepare("SELECT * FROM progress WHERE userId=? AND courseId=?")
      .get(userId, courseId);

    if (!row) {
      return res.json({
        completedLessons: [],
        lastAccessedLesson: null,
        lastAccessedAt: null,
        completedAt: null,
      });
    }

    const lessons = JSON.parse(row.completedLessons || "[]");

    res.json({
      completedLessons: lessons,
      lastAccessedLesson: row.lastAccessedLesson,
      lastAccessedAt: row.lastAccessedAt,
      completedAt: row.completedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* MARK LESSON COMPLETE */
router.post("/complete", (req, res) => {
  const { userId, courseId, lessonId } = req.body;

  try {
    const row = db
      .prepare("SELECT completedLessons FROM progress WHERE userId=? AND courseId=?")
      .get(userId, courseId);

    let lessons = row ? JSON.parse(row.completedLessons || "[]") : [];

    if (!lessons.includes(lessonId)) lessons.push(lessonId);

    const lessonsJSON = JSON.stringify(lessons);

    if (!row) {
      db.prepare(
        "INSERT INTO progress (userId, courseId, completedLessons) VALUES (?, ?, ?)"
      ).run(userId, courseId, lessonsJSON);
    } else {
      db.prepare(
        "UPDATE progress SET completedLessons=? WHERE userId=? AND courseId=?"
      ).run(lessonsJSON, userId, courseId);
    }

    res.json({ success: true, completedLessons: lessons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE LAST ACCESSED */
router.post("/last-accessed", (req, res) => {
  const { userId, courseId, lessonId } = req.body;

  try {
    db.prepare(
      "UPDATE progress SET lastAccessedLesson=?, lastAccessedAt=? WHERE userId=? AND courseId=?"
    ).run(lessonId, new Date().toISOString(), userId, courseId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;