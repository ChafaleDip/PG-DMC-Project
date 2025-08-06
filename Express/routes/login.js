const pool = require("../utils/dbpool");
const { apiSuccess, apiError } = require("../utils/apiresult");
const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Query registration table
  pool.query("SELECT * FROM registration WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        res.json({ message: "Login successful", user: result[0] });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  );
});

module.exports = router;



// router.post("/customers/login", (req, res) => {
//   const email = req.body.email?.trim();
//   const password = req.body.password?.trim();
//   pool.query("SELECT * FROM customers WHERE email = ? AND password = ?",
//     [email, password],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err });
//       if (result.length > 0) {
//         res.json({ message: "Login successful", user: result[0] });
//       } else {
//         res.status(401).json({ message: "Invalid credentials" });
//       }
//     }
//   );
// });



// router.post('/customers/login', (req, res) => {
//   const { email, password } = req.body;
//   pool.query("SELECT * FROM customers WHERE email = ?", [email], async (err, results) => {
//     if (err) return res.status(500).json(err);
//     if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

//     const user = results[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (isMatch) {
//       res.json(user);
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   });
// });

// app.get('/api/test', (req, res) => {
//   res.send('Backend is working!');
// });


