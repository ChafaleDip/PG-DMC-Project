const pool = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const router = express.Router()

// Customer Registration  //OKAY
router.post('/customers/register', (req, res) => {
  const { name, email, phone, password, address, vehicle_model, vehicle_no } = req.body;
  pool.query(`INSERT INTO customers (name, email, phone, password, address, vehicle_model, vehicle_no)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, password, address, vehicle_model, vehicle_no],
    (err, result) => {
      if (err) {
      console.error("Error inserting:", err);
      return res.status(500).json(err);
    }
      res.json({ message: 'Customer registered', id: result.insertId });
    }
  );
});

// Customer Login
router.post('/customers/login', (req, res) => {
  const { email, password } = req.body;
  pool.query("SELECT * FROM customers WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) return res.json(results[0]);
    res.status(401).json({ message: 'Invalid credentials' });

  });
});

// Customers - Get All //OKAY
router.get('/customers', (req, res) => {
  pool.query("SELECT * FROM customers", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Get Customer Bookings
router.get('/customers/:id/bookings', (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM bookings WHERE customer_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Customer Bookings with Service Details
router.get('/customers/:id/bookings', (req, res) => {
  const { id } = req.params;
  pool.query(`SELECT b.*, s.service AS service_name, s.description AS service_description FROM bookings b
    JOIN service_list s ON b.service_id = s.id WHERE b.customer_id = ?`, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Customers - Update
router.put('/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password, address, vehicle_model, vehicle_no } = req.body;
  pool.query(`UPDATE customers SET name = ?, email = ?, phone = ?, password = ?, address = ?, vehicle_model = ?, vehicle_no = ? WHERE id = ?`,
    [name, email, phone, password, address, vehicle_model, vehicle_no, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Customer updated' });
    }
  );
});


// Customers - Delete
router.delete('/customers/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM customers WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Customer deleted' });
  });
});


module.exports = router






// const express = require('express');
// const router = express.Router();
// const pool = require("../utils/dbpool")
// const bcrypt = require('bcrypt');

// // Register API with bcrypt password hashing
// router.post('/register', async (req, res) => {
//   const { name, email, phone, password, address, vehicle_model, vehicle_no } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql = `
//       INSERT INTO customers (name, email, phone, password, address, vehicle_model, vehicle_no)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;

//     pool.query(sql, [name, email, phone, hashedPassword, address, vehicle_model, vehicle_no], (err, results) => {
//       if (err) {
//         console.error('Error inserting customer:', err);
//         return res.status(500).json({ error: 'Database error during registration' });
//       }
//       res.status(201).json({ message: 'Customer registered successfully' });
//     });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Login API with bcrypt password comparison
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const sql = 'SELECT * FROM customers WHERE email = ?';

//     pool.query(sql, [email], async (err, results) => {
//       if (err) {
//         console.error('Login query error:', err);
//         return res.status(500).json({ error: 'Database error during login' });
//       }

//       if (results.length === 0) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }

//       const user = results[0];
//       const isMatch = await bcrypt.compare(password, user.password);

//       if (isMatch) {
//         res.status(200).json({ message: 'Login successful', user });
//       } else {
//         res.status(401).json({ error: 'Invalid email or password' });
//       }
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;


