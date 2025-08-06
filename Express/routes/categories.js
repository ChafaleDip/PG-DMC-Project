const pool = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const router = express.Router()

// GET all categories
router.get('/', (req, res) => {
  pool.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST a new category
router.post('/', (req, res) => {
  const { category, status } = req.body;
  pool.query(
    'INSERT INTO categories (category, status) VALUES (?, ?)',
    [category, status || 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Category created', id: result.insertId });
    }
  );
});

// PUT (update) a category by ID
router.put('/:id', (req, res) => {
  const { category, status } = req.body;
  pool.query(
    'UPDATE categories SET category = ?, status = ? WHERE id = ?',
    [category, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Category updated' });
    }
  );
});

// DELETE a category by ID
router.delete('/:id', (req, res) => {
  pool.query('DELETE FROM categories WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Category deleted' });
  });
});

module.exports = router;
