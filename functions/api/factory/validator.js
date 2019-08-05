const { check } = require('express-validator');

const validateCreateOrUpdate = [
  check('name', 'Factory name is required').not().isEmpty(),
];

module.exports = {
  validateCreateOrUpdate,
};
