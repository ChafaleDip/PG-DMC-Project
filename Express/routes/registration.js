const pool = require("../utils/dbpool");
const { apiSuccess, apiError } = require("../utils/apiresult");
const express = require("express");
const router = express.Router();

// routes/registration.js or customers.js
router.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `INSERT INTO registration (name, email, phone, password) VALUES (?, ?, ?, ?)`;
  pool.query(sql, [name, email, phone, password], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Registration failed", error: err });
    }
    res.status(200).json({ message: "User registered successfully", id: result.insertId });
  });
});

module.exports = router

