const pool = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const router = express.Router()

// Billing - Get All
router.get('/billings', (req, res) => {
  pool.query("SELECT * FROM billing", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add Billing Entry
router.post('/bill', (req, res) => {
  const { booking_id, amount, bill_date } = req.body;
  pool.query(`INSERT INTO billing (booking_id, amount, bill_date) VALUES (?, ?, ?)`,
    [booking_id, amount, bill_date],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Billing entry added', id: result.insertId });
    }
  );
});


//Get Billing with Booking & Customer Info
router.get('/billing', (req, res) => {
  pool.query(`SELECT bill.id, bill.amount, bill.bill_date, b.service_type, c.name AS customer_name, 
    c.vehicle_no FROM billing bill JOIN bookings b ON bill.booking_id = b.id JOIN customers c ON b.customer_id = c.id`, 
    (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;

