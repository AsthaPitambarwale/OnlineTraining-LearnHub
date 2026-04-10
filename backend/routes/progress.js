const express = require("express");
const router = express.Router();
const db = require("../db");

// GET COURSE PROGRESS
router.get("/:userId/:courseId", (req, res) => {
  const { userId, courseId } = req.params;

  db.get(
    "SELECT * FROM progress WHERE userId=? AND courseId=?",
    [userId, courseId],
    (err, row) => {
      if (err) {
        console.error("GET progress error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.json({
          completedLessons: [],
          lastAccessedLesson: null,
          lastAccessedAt: null,
          completedAt: null,
        });
      }

      let lessons = [];

      try {
        lessons = JSON.parse(row.completedLessons || "[]");
      } catch {
        lessons = [];
      }

      res.json({
        completedLessons: lessons,
        lastAccessedLesson: row.lastAccessedLesson,
        lastAccessedAt: row.lastAccessedAt,
        completedAt: row.completedAt,
      });
    }
  );
});

// MARK LESSON COMPLETE
router.post("/complete", (req, res) => {
  const { userId, courseId, lessonId } = req.body;

  if (!userId || !courseId || !lessonId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.get(
    "SELECT completedLessons FROM progress WHERE userId=? AND courseId=?",
    [userId, courseId],
    (err, row) => {
      if (err) {
        console.error("Select error:", err);
        return res.status(500).json({ error: err.message });
      }

      let lessons = [];

      if (row && row.completedLessons) {
        try {
          lessons = JSON.parse(row.completedLessons);
        } catch {
          lessons = [];
        }
      }

      if (!lessons.includes(lessonId)) {
        lessons.push(lessonId);
      }

      const lessonsJSON = JSON.stringify(lessons);

      if (!row) {
        // INSERT
        db.run(
          "INSERT INTO progress (userId, courseId, completedLessons) VALUES (?, ?, ?)",
          [userId, courseId, lessonsJSON],
          function (err) {
            if (err) {
              console.error("Insert error:", err);
              return res.status(500).json({ error: err.message });
            }

            res.json({ success: true, completedLessons: lessons });
          }
        );
      } else {
        // UPDATE
        db.run(
          "UPDATE progress SET completedLessons=? WHERE userId=? AND courseId=?",
          [lessonsJSON, userId, courseId],
          function (err) {
            if (err) {
              console.error("Update error:", err);
              return res.status(500).json({ error: err.message });
            }

            res.json({ success: true, completedLessons: lessons });
          }
        );
      }
    }
  );
});

// UPDATE LAST ACCESSED
router.post("/last-accessed", (req, res) => {
  const { userId, courseId, lessonId } = req.body;

  db.run(
    "UPDATE progress SET lastAccessedLesson=?, lastAccessedAt=? WHERE userId=? AND courseId=?",
    [lessonId, new Date().toISOString(), userId, courseId],
    function (err) {
      if (err) {
        console.error("Last accessed error:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json({ success: true });
    }
  );
});

module.exports = router;