const { validationResult } = require('express-validator');

const validateRequest = async (req, res) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }
};

module.exports = {
  validateRequest,
};
