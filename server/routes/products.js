const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { handleValidation } = require('../middleware/validate');

module.exports = function (db) {
  router.get('/', (req, res) => {
    try {
      const products = db.prepare(
        'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC'
      ).all();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get(
    '/:slug',
    param('slug').trim().isLength({ min: 1, max: 120 }).withMessage('Invalid product slug'),
    handleValidation,
    (req, res) => {
      try {
        const product = db.prepare(
          'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?'
        ).get(req.params.slug);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  return router;
};