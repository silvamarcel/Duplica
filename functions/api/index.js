const router = require('express').Router();
const factoryRoutes = require('./factory/routes');

router.use('/factories', factoryRoutes);

module.exports = router;
