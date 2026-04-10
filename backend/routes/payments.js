const express = require("express")
const router = express.Router()
const db = require("../db")

/* GET PAYMENTS */
router.get("/", (req, res) => {

  db.all("SELECT * FROM payments", [], (err, rows) => {

    if (err) return res.status(500).json({ error: err.message })

    res.json(rows)

  })

})


/* CREATE PAYMENT */
router.post("/", (req, res) => {

  const p = req.body

  if (!p.userId || !p.courseId || !p.amount) {
    return res.status(400).json({ error: "Missing payment data" })
  }

  const id = Date.now().toString()
  const date = new Date().toISOString().slice(0, 10)

  db.run(
    `INSERT INTO payments
    (id,userId,userName,courseId,courseTitle,amount,date,status)
    VALUES(?,?,?,?,?,?,?,?)`,
    [
      id,
      p.userId,
      p.userName || "",
      p.courseId,
      p.courseTitle || "",
      p.amount,
      date,
      p.status || "completed"
    ],
    function (err) {

      if (err) return res.status(500).json({ error: err.message })

      res.json({ success: true, id })

    }
  )

})

module.exports = router