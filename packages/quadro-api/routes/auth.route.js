const router = require('express').Router();
const {
  register,
  login,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, currentUser);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resetToken', resetPassword);

module.exports = router;
