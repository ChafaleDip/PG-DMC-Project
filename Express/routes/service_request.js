const pool = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const router = express.Router()

// Get Active Services
router.get('/services', (req, res) => {
  pool.query("SELECT * FROM service_list WHERE status = 1", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);

  });
});


// Get Active Services (option)
router.get('/service_requests', (req, res) => {
  pool.query("SELECT * FROM service_requests", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add Service Request
router.post('/service_requests', (req, res) => {
  const { owner_name, category_id, service_type, mechanic_id } = req.body;
  pool.query(`INSERT INTO service_requests (owner_name, category_id, service_type, mechanic_id) VALUES (?, ?, ?, ?)`,
    [owner_name, category_id, service_type, mechanic_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Service request created', id: result.insertId });
    }
  );
});

// Get Service Requests with Category and Mechanic Info
router.get('/service_requests', (req, res) => {
  pool.query(`SELECT sr.*, cat.name AS category_name, m.name AS mechanic_name 
    FROM service_requests sr JOIN categories cat ON sr.category_id = cat.id
    JOIN mechanics_list m ON sr.mechanic_id = m.id`, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router