const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET ALL COURSES */
router.get("/", (req, res) => {

  db.all("SELECT * FROM courses", [], (err, rows) => {

    if (err) return res.status(500).json({ error: err.message });

    const courses = rows.map(c => {
      let modules = []

      try {
        modules = c.modules ? JSON.parse(c.modules) : []
      } catch {
        modules = []
      }

      return { ...c, modules }
    })

    res.json(courses)

  })

})


/* CREATE COURSE */
router.post("/", (req, res) => {

  const c = req.body

  if (!c.title || !c.price) {
    return res.status(400).json({ error: "Title and price required" })
  }

  const id = Date.now().toString()

  db.run(
    `INSERT INTO courses
    (id,title,description,price,instructor,category,thumbnail,duration,rating,studentsEnrolled,modules)
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    [
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
    ],
    function (err) {

      if (err) return res.status(500).json({ error: err.message })

      res.json({ success: true, id })

    }
  )

})


/* UPDATE COURSE */
router.put("/:id", (req, res) => {

  const c = req.body

  db.run(
    `UPDATE courses SET
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
      WHERE id=?`,
    [
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
    ],
    function (err) {

      if (err) return res.status(500).json({ error: err.message })

      res.json({ success: true })

    }
  )

})


/* DELETE COURSE */
router.delete("/:id", (req, res) => {

  db.run(
    "DELETE FROM courses WHERE id=?",
    [req.params.id],
    function (err) {

      if (err) return res.status(500).json({ error: err.message })

      res.json({ success: true })

    }
  )

})


/* UPDATE COURSE MODULES */
router.put("/:id/modules", (req, res) => {

  const modules = req.body.modules

  if (!modules) {
    return res.status(400).json({ error: "Modules missing" })
  }

  db.run(
    "UPDATE courses SET modules=? WHERE id=?",
    [JSON.stringify(modules), req.params.id],
    function (err) {

      if (err) return res.status(500).json({ error: err.message })

      res.json({ success: true })

    }
  )

})

module.exports = router