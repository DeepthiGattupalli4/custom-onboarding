const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database("./user_data.db");

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        password TEXT,
        aboutMe TEXT,
        street TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        birthdate TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS config (
        component TEXT PRIMARY KEY,
        page INTEGER
    )`);

  // Default config setup
  db.run(
    `INSERT OR IGNORE INTO config (component, page) VALUES ('aboutMe', 2)`
  );
  db.run(
    `INSERT OR IGNORE INTO config (component, page) VALUES ('birthdate', 2)`
  );
  db.run(
    `INSERT OR IGNORE INTO config (component, page) VALUES ('address', 3)`
  );
});

// API to save user data
app.post("/api/users", (req, res) => {
  const { email, password, aboutMe, street, city, state, zip, birthdate } =
    req.body;
  db.run(
    `INSERT INTO users (email, password, aboutMe, street, city, state, zip, birthdate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [email, password, aboutMe, street, city, state, zip, birthdate],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// API to get all users
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API to get config
app.get("/api/config", (req, res) => {
  db.all("SELECT * FROM config", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API to update config
app.post("/api/config", (req, res) => {
  const { component, page } = req.body;
  db.run(
    `INSERT OR REPLACE INTO config (component, page) VALUES (?, ?)`,
    [component, page],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ status: "updated" });
    }
  );
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
