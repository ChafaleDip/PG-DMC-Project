const pool = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const router = express.Router()


// GET All Booking
router.get('/bookings', (req, res) => {
  pool.query("SELECT * FROM bookings", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Add Booking
router.post('/booking', (req, res) => {
  const { customer_id, service_id, vehicle_model, vehicle_no, service_date, status } = req.body;
  pool.query(`INSERT INTO bookings (customer_id, service_id, vehicle_model, vehicle_no, service_date, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [customer_id, service_id, vehicle_model, vehicle_no, service_date, status],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Booking created', id: result.insertId });
    }
  );
});

// Book a Service
router.post('/book', (req, res) => {
  const { customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date } = req.body;
  pool.query(`INSERT INTO bookings (customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date) VALUES (?, ?, ?, ?, ?, ?)`,
    [customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Booking created', id: result.insertId });
    }
  );
});


// Update Booking
router.put('/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date, status } = req.body;
  pool.query(`UPDATE bookings SET customer_id = ?, service_id = ?, service_type = ?, vehicle_no = ?, vehicle_model = ?, booking_date = ?, status = ? WHERE id = ?`,
    [customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Booking updated' });
    }
  );
});


// Bookings - Delete
router.delete('/bookings/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM bookings WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Booking deleted' });
  });
});


//Optional: Get All Bookings for Admin (with Joins)
router.get('/bookingGet', (req, res) => {
  pool.query(`SELECT b.*, c.name AS customer_name, c.vehicle_model, s.service AS service_name FROM bookings b JOIN customers c ON b.customer_id = c.id
    JOIN service_list s ON b.service_id = s.id`, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;