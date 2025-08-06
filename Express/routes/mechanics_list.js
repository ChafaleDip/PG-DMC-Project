const pool = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const router = express.Router()

// Get All Mechanics
router.get('/mechanics', (req, res) => {
  pool.query("SELECT * FROM mechanics_list", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get Single Mechanic
router.get('/mechanics/:id', (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM mechanics_list WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// Create Mechanic
router.post('/mechanics', (req, res) => {
  const { name, contact, email, status } = req.body;
  pool.query("INSERT INTO mechanics_list (name, contact, email, status) VALUES (?, ?, ?, ?)",
    [name, contact, email, status],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Mechanic added', id: result.insertId });
    }
  );
});

// Update Mechanic
router.put('/mechanics/:id', (req, res) => {
  const { id } = req.params;
  const { name, contact, email, status } = req.body;
  pool.query("UPDATE mechanics_list SET name = ?, contact = ?, email = ?, status = ? WHERE id = ?",
    [name, contact, email, status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Mechanic updated' });
    }
  );
});

// Delete Mechanic
router.delete('/mechanics/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM mechanics_list WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Mechanic deleted' });
  });
});


module.exports = router