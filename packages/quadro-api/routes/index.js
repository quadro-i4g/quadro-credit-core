const authRouter = require('./auth.route');

module.exports = router => {
  router.use('/auth', authRouter);

  return router;
};
