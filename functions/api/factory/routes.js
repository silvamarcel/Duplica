const router = require('express').Router();
const controller = require('./controller');
const validator = require('./validator');

router.param('id', controller.params);

router.route('/')
  .get(controller.list)
  .post(
    validator.validateCreateOrUpdate,
    controller.create
  );

router.route('/:id')
  .get(controller.read)
  .put(
    validator.validateCreateOrUpdate,
    controller.update
  )
  .delete(controller.delete);

module.exports = router;
