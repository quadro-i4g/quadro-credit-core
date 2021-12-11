const authRouter = require('./auth.route');
const creditRouter = require('./credit.route');

module.exports = router => {
  router.use('/auth', authRouter);
  router.use('/credit', creditRouter);

  return router;
};
