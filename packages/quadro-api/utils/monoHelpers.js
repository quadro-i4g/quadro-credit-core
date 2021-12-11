const axios = require('axios');

const monoUrl = 'https://api.withmono.com';
const getMonoId = async code => {
  try {
    return await axios({
      method: 'POST',
      url: `${monoUrl}/account/auth`,
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': `${process.env.MONO_SEC_KEY}`,
      },
      data: { code },
    });
  } catch (err) {
    return console.error(err);
  }
};

const getMonoStatements = async monoID => {
  try {
    return await axios({
      method: 'get',
      url: `${monoUrl}/accounts/${monoID}/statement`,
      headers: {
        'mono-sec-key': `${process.env.MONO_SEC_KEY}`,
      },
    });
  } catch (err) {
    return console.error(err);
  }
};

module.exports = { getMonoId, getMonoStatements };
