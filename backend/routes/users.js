const express = require("express")
const router = express.Router()
const db = require("../db")

/* GET USERS */
router.get("/", (req, res) => {

  const query = `
    SELECT 
      users.*,
      COUNT(enrollments.courseId) AS courses
    FROM users
    LEFT JOIN enrollments
      ON users.id = enrollments.userId
    GROUP BY users.id
  `

  db.all(query, [], (err, rows) => {

    if (err) return res.status(500).json({ error: err.message })

    res.json(rows)

  })

})

/* CREATE USER */
router.post("/", (req, res) => {

  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password required" })
  }

  const id = Date.now().toString()

  db.run(
    "INSERT INTO users (id,name,email,password,role) VALUES(?,?,?,?,?)",
    [id, name, email, password, role || "student"],
    function (err) {

      if (err) return res.status(500).json({ error: err.message })

      res.json({
        id,
        name,
        email,
        role: role || "student"
      })

    }
  )

})

/* DELETE USER */
router.delete("/:id", (req, res) => {

  db.run(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    function (err) {

      if (err) return res.status(500).json({ error: err.message })

      res.json({ success: true })

    }
  )

})

module.exports = router