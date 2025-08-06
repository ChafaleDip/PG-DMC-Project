const pool = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const router = express.Router()

// // Feedback - Get All
router.get('/feedback', (req, res) => {
  pool.query("SELECT * FROM feedback", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

//Get Feedback with Customer & Service Info
router.get('/feedback', (req, res) => {
  pool.query(`SELECT f.*, c.name AS customer_name, s.service AS service_name FROM feedback f JOIN customers c ON f.customer_id = c.id
    JOIN service_list s ON f.service_id = s.id`, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Feedback - Update
router.put('/feedback/:id', (req, res) => {
  const { id } = req.params;
  const { customer_id, service_id, rating, comments } = req.body;
  pool.query(`UPDATE feedback SET customer_id = ?, service_id = ?, rating = ?, comments = ? WHERE id = ?`,
    [customer_id, service_id, rating, comments, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Feedback updated' });
    }
  );
});

/////
router.get('/feedback', (req, res) => {
  pool.query(`SELECT f.*, c.name AS customer_name, 
    s.service AS service_name FROM feedback f JOIN customers c ON f.customer_id = c.id JOIN service_list s ON f.service_id = s.id`, 
    (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Submit Feedback
router.post('/feedback', (req, res) => {
  const { customer_id, service_id, rating, comments } = req.body;
  pool.query(`INSERT INTO feedback (customer_id, service_id, rating, comments) VALUES (?, ?, ?, ?)`,
    [customer_id, service_id, rating, comments],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Feedback submitted', id: result.insertId });
    }
  );
});


// Feedback - Delete
router.delete('/feedback/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM feedback WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Feedback deleted' });
  });
});


module.exports = router
