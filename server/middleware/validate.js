const { validationResult } = require('express-validator');

// Run after express-validator chains; returns first error messages
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ error: errors.array({ onlyFirstError: true }).map((e) => e.msg).join(', ') });
  }
  next();
}

// Strip control characters / null bytes before storage (defence in depth)
function cleanField(value, maxLen) {
  if (typeof value !== 'string') return '';
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

module.exports = { handleValidation, cleanField };