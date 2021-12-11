const router = require('express').Router();
const {
  getCreditDataWithCode,
  getCreditDataWithID,
} = require('../controllers/credit.controller');

router.post('/score', getCreditDataWithCode);
router.get('/score/:id', getCreditDataWithID);

module.exports = router;
