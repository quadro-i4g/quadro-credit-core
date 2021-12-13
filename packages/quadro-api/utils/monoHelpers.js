const axios = require('axios');

const monoUrl = 'https://api.withmono.com';
const getMonoId = async code => {
  return axios({
    method: 'POST',
    url: `${monoUrl}/account/auth`,
    headers: {
      'Content-Type': 'application/json',
      'mono-sec-key': `${process.env.MONO_SEC_KEY}`,
    },
    data: { code },
  });
};

const getMonoStatements = async monoID => {
  return axios({
    method: 'get',
    url: `${monoUrl}/accounts/${monoID}/statement`,
    headers: {
      'mono-sec-key': `${process.env.MONO_SEC_KEY}`,
    },
  });
};

module.exports = { getMonoId, getMonoStatements };
