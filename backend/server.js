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

/* ✅ AUTO SEED DATABASE */

try {
  const insertCourse = db.prepare(`
    INSERT OR IGNORE INTO courses
    (id,title,description,price,instructor,category,thumbnail,duration,rating,studentsEnrolled,modules)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `);

  seedData.courses.forEach((course) => {
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

  console.log("✅ Database seeded successfully");
} catch (err) {
  console.error("❌ Seeding error:", err.message);
}

/* ROUTES */

app.use("/courses", courses);
app.use("/users", users);
app.use("/enrollments", enrollments);
app.use("/payments", payments);
app.use("/progress", progress);
app.use("/api/razorpay", razorpay);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
/* ✅ DEBUG ROUTE */

app.get("/debug", (req, res) => {
  try {
    const coursesData = db.prepare("SELECT * FROM courses").all();
    const usersData = db.prepare("SELECT * FROM users").all();
    const paymentsData = db.prepare("SELECT * FROM payments").all();
    const enrollmentsData = db.prepare("SELECT * FROM enrollments").all();

    res.json({
      courses: coursesData,
      users: usersData,
      payments: paymentsData,
      enrollments: enrollmentsData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res, next) => {
  console.log("👉", req.method, req.url);
  next();
});
/* SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
