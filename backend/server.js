const express = require("express");
const cors = require("cors");

const db = require("./db");

const courses = require("./routes/courses");
const users = require("./routes/users");
const enrollments = require("./routes/enrollments");
const payments = require("./routes/payments");
const progress = require("./routes/progress");
const razorpay = require("./routes/razorpay");
const seedData = require("./seedData.json");
const app = express();

app.use(cors());
app.use(express.json());

/* AUTO SEED DATABASE */

db.serialize(() => {

  const insertCourse = db.prepare(`
  INSERT OR IGNORE INTO courses
  (id,title,description,price,instructor,category,thumbnail,duration,rating,studentsEnrolled,modules)
  VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `);

  seedData.courses.forEach(course => {
    insertCourse.run(
      course.id,
      course.title,
      course.description,
      course.price,
      course.instructor,
      course.category,
      course.thumbnail,
      course.duration,
      course.rating,
      course.studentsEnrolled,
      course.modules
    );
  });

  console.log("Database seeded successfully");

});
/* ROUTES */

app.use("/courses", courses);
app.use("/users", users);
app.use("/enrollments", enrollments);
app.use("/payments", payments);
app.use("/progress", progress);
app.use("/razorpay", razorpay);

/* DEBUG ROUTE */

app.get("/debug", (req, res) => {

  db.all("SELECT * FROM courses", (e1, courses) => {

    db.all("SELECT * FROM users", (e2, users) => {

      db.all("SELECT * FROM payments", (e3, payments) => {

        db.all("SELECT * FROM enrollments", (e4, enrollments) => {

          res.json({
            courses,
            users,
            payments,
            enrollments
          });

        });

      });

    });

  });

});

/* SERVER */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

