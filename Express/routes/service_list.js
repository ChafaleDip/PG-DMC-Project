const pool = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const router = express.Router()

// GET all services
router.get('/', (req, res) => {
  pool.query('SELECT * FROM service_list', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST a new service
router.post('/', (req, res) => {
  const { service, description, status } = req.body;
  pool.query(
    'INSERT INTO service_list (service, description, status) VALUES (?, ?, ?)',
    [service, description, status || 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Service created', id: result.insertId });
    }
  );
});

// PUT (update) a service by ID
router.put('/:id', (req, res) => {
  const { service, description, status } = req.body;
  pool.query(
    'UPDATE service_list SET service = ?, description = ?, status = ? WHERE id = ?',
    [service, description, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Service updated' });
    }
  );
});

// DELETE a service by ID
router.delete('/:id', (req, res) => {
  pool.query('DELETE FROM service_list WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Service deleted' });
  });
});

module.exports = router;
