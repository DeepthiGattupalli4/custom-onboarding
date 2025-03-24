const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./user_data.db");
db.run(`DELETE FROM config`, (err) => {
  if (err) console.error("Error clearing config table:", err.message);
  else console.log("Config table cleared.");
});
const sampleUsers = [
  {
    email: "john@example.com",
    password: "john123",
    aboutMe: "I love coding and coffee.",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    birthdate: "1990-01-01",
  },
  {
    email: "jane@example.com",
    password: "jane456",
    aboutMe: "Designer and cat lover.",
    street: "456 Oak Ave",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    birthdate: "1992-05-12",
  },
  {
    email: "alex@example.com",
    password: "alex789",
    aboutMe: "Gamer, streamer, adventurer.",
    street: "789 Pine Rd",
    city: "Austin",
    state: "TX",
    zip: "73301",
    birthdate: "1988-07-25",
  },
];

// Insert Users
sampleUsers.forEach((user) => {
  db.run(
    `INSERT INTO users (email, password, aboutMe, street, city, state, zip, birthdate)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.email,
      user.password,
      user.aboutMe,
      user.street,
      user.city,
      user.state,
      user.zip,
      user.birthdate,
    ],
    function (err) {
      if (err) {
        console.error("User Insert Error:", err.message);
      } else {
        console.log(`Inserted user with ID ${this.lastID}`);
      }
    }
  );
});

// --- Section 2: Seed Admin Config ---
const adminConfig = [
  { component: "aboutMe", page: 2 },
  { component: "birthdate", page: 2 },
  { component: "address", page: 3 },
];

// Insert Config
adminConfig.forEach((cfg) => {
  db.run(
    `INSERT INTO config (component, page) VALUES (?, ?)`,
    [cfg.component, cfg.page],
    function (err) {
      if (err) {
        console.error("Config Insert Error:", err.message);
      } else {
        console.log(`Inserted config: ${cfg.component} on Page ${cfg.page}`);
      }
    }
  );
});

db.close();
