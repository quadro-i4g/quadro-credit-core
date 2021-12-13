const { calculateCredit } = require('../utils/creditMethods');
const { getMonoId, getMonoStatements } = require('../utils/monoHelpers');

/**
 * @desc    Fetch Credit of the user based on the user's account code
 * @route   POST /api/v1/credit/score
 * @access  Public
 */
exports.getCreditDataWithCode = async (req, res, next) => {
  const data = req.body;
  if (!data.code) {
    return res.status(400).json({
      message: 'Invalid request, please check your request and try again.',
    });
  }

  try {
    const response = await getMonoId(data.code);
    const statementData = await getMonoStatements(response.data.id);
    const scores = calculateCredit(statementData.data.data);
    return res.status(200).json({ scores, id: response.data.id });
  } catch (err) {
    return res.status(400).json(err.response.data);
  }
};

/**
 * @desc    Fetch Credit of the user based on the user's account id
 * @route   GET /api/v1/credit/score/:id
 * @access  Public
 */
exports.getCreditDataWithID = async (req, res, next) => {
  try {
    const response = await getMonoStatements(req.params.id);
    const scores = calculateCredit(response.data.data);
    return res.status(200).json({ scores, id: req.params.id });
  } catch (err) {
    return res.status(400).json(err.response.data);
  }
};
