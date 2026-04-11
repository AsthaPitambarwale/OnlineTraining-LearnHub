const Database = require("better-sqlite3");

// Create / connect DB
const db = new Database("lms.db");

// Enable foreign keys
db.exec("PRAGMA foreign_keys = ON");

try {
  /* COURSES TABLE */
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses(
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL DEFAULT 0,
      instructor TEXT NOT NULL,
      category TEXT NOT NULL,
      thumbnail TEXT,
      duration TEXT,
      rating REAL DEFAULT 0,
      studentsEnrolled INTEGER DEFAULT 0,
      modules TEXT DEFAULT '[]'
    );
  `);

  /* USERS TABLE */
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      role TEXT NOT NULL DEFAULT 'student'
    );
  `);

  /* ENROLLMENTS TABLE */
  db.exec(`
    CREATE TABLE IF NOT EXISTS enrollments(
      userId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      PRIMARY KEY (userId, courseId),

      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
    );
  `);

  /* PAYMENTS TABLE */
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments(
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      courseId TEXT NOT NULL,
      courseTitle TEXT NOT NULL,
      amount INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',

      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (courseId) REFERENCES courses(id)
    );
  `);

  /* PROGRESS TABLE */
  db.exec(`
    CREATE TABLE IF NOT EXISTS progress (
      userId TEXT,
      courseId TEXT,
      completedLessons TEXT,
      lastAccessedLesson TEXT,
      lastAccessedAt TEXT,
      completedAt TEXT
    );
  `);

  /* INDEXES */
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_course_category ON courses(category);
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(userId);
    CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(userId);
  `);

  console.log("✅ Database connected & initialized");
} catch (err) {
  console.error("❌ DB Error:", err.message);
}

module.exports = db;
