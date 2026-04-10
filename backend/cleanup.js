const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./lms.db");

db.serialize(() => {
  db.run("DELETE FROM users WHERE id IS 1775240597913");
  // db.run("DELETE FROM users WHERE name IS NULL");
  // db.run("DELETE FROM users WHERE email IS NULL");
  // db.run("DELETE FROM enrollments WHERE courseId IS NULL");
  // db.run("DELETE FROM enrollments WHERE userId IS NULL");

  console.log("Null records deleted");
});

db.close();
