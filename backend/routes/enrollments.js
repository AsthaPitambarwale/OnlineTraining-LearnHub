const express = require("express")
const router = express.Router()
const db = require("../db")

/* GET USER ENROLLMENTS */
router.get("/:userId", (req, res) => {

  db.all(
    "SELECT userId, courseId FROM enrollments WHERE userId=?",
    [req.params.userId],
    (err, rows) => {

      if (err) {
        return res.status(500).json({ error: err.message })
      }

      res.json(rows)

    }
  )

})


/* CREATE ENROLLMENT */
router.post("/", (req, res) => {

  const { userId, courseId } = req.body

  if (!userId || !courseId) {
    return res.status(400).json({ error: "Missing enrollment data" })
  }

  db.run(
    "INSERT OR IGNORE INTO enrollments (userId,courseId) VALUES(?,?)",
    [userId, courseId],
    function (err) {

      if (err) {
        return res.status(500).json({ error: err.message })
      }

      res.json({
        success: true,
        userId,
        courseId
      })

    }
  )

})

module.exports = router