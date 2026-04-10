const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./lms.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

/* Enable foreign keys */
db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {
  /* COURSES TABLE */
  db.run(`
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
    )
  `);

  /* USERS TABLE */
  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      role TEXT NOT NULL DEFAULT 'student'
    )
  `);

  /* ENROLLMENTS TABLE */
  db.run(`
    CREATE TABLE IF NOT EXISTS enrollments(
      userId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      PRIMARY KEY (userId, courseId),

      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
    )
  `);

  /* PAYMENTS TABLE */
  db.run(`
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
    )
  `);

  /* PROGRESS TABLE */
  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
    userId TEXT,
    courseId TEXT,
    completedLessons TEXT,
    lastAccessedLesson TEXT,
    lastAccessedAt TEXT,
    completedAt TEXT
    );
  `);

  /* INDEXES FOR PERFORMANCE */
  db.run(`CREATE INDEX IF NOT EXISTS idx_course_category ON courses(category)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(userId)`);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(userId)`,
  );
});

module.exports = db;
