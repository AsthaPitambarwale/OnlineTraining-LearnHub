const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET ALL COURSES */
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM courses").all();

    const courses = rows.map((c) => {
      let modules = [];

      try {
        modules = c.modules ? JSON.parse(c.modules) : [];
      } catch {
        modules = [];
      }

      return { ...c, modules };
    });

    res.json(courses);
  } catch (err) {
    console.error("GET courses error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* CREATE COURSE */
router.post("/", (req, res) => {
  try {
    const c = req.body;

    if (!c.title || !c.price) {
      return res.status(400).json({ error: "Title and price required" });
    }

    const id = Date.now().toString();

    db.prepare(`
      INSERT INTO courses
      (id,title,description,price,instructor,category,thumbnail,duration,rating,studentsEnrolled,modules)
      VALUES(?,?,?,?,?,?,?,?,?,?,?)
    `).run(
      id,
      c.title,
      c.description || "",
      c.price,
      c.instructor || "",
      c.category || "",
      c.thumbnail || "",
      c.duration || "",
      c.rating || 0,
      c.studentsEnrolled || 0,
      JSON.stringify(c.modules || [])
    );

    res.json({ success: true, id });
  } catch (err) {
    console.error("CREATE course error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE COURSE */
router.put("/:id", (req, res) => {
  try {
    const c = req.body;

    db.prepare(`
      UPDATE courses SET
        title=?,
        description=?,
        price=?,
        instructor=?,
        category=?,
        thumbnail=?,
        duration=?,
        rating=?,
        studentsEnrolled=?,
        modules=?
      WHERE id=?
    `).run(
      c.title,
      c.description,
      c.price,
      c.instructor,
      c.category,
      c.thumbnail,
      c.duration,
      c.rating,
      c.studentsEnrolled,
      JSON.stringify(c.modules || []),
      req.params.id
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE course error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* DELETE COURSE */
router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM courses WHERE id=?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE course error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE MODULES */
router.put("/:id/modules", (req, res) => {
  try {
    const { modules } = req.body;

    if (!modules) {
      return res.status(400).json({ error: "Modules missing" });
    }

    db.prepare("UPDATE courses SET modules=? WHERE id=?")
      .run(JSON.stringify(modules), req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE modules error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;