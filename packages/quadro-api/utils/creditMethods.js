const dateDiffInDays = (a, b) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const grading = score => {
  let grade = '';

  if (score >= 0 && score <= 49) grade = 'F';
  else if (score >= 50 && score <= 59) grade = 'E';
  else if (score >= 60 && score <= 69) grade = 'D';
  else if (score >= 70 && score <= 79) grade = 'C';
  else if (score >= 80 && score <= 89) grade = 'B';
  else if (score >= 90 && score <= 100) grade = 'A';
  else {
    Error('Invalid score');
    grade = 'N/A';
  }

  return grade;
};

const reduceData = data => {
  let debitAmt = 0;
  let creditAmt = 0;

  const dates = {
    start: new Date(data[data.length - 1].date),
    end: new Date(data[0].date),
  };

  const balance = {
    start: data[data.length - 1].balance,
    end: data[0].balance,
  };

  data.forEach(({ amount, type }) => {
    if (type === 'debit') {
      debitAmt += amount;
    } else if (type === 'credit') {
      creditAmt += amount;
    }
  });

  return {
    amounts: { debitAmt, creditAmt },
    dates,
    balance,
  };
};

const calculateCredit = data => {
  const { amounts, dates, balance } = reduceData(data);
  const { debitAmt, creditAmt } = amounts;
  const totalDays = dateDiffInDays(dates.start, dates.end);

  let score = 0;
  let total = 0;
  const SCORE_MIN = Math.ceil(0);
  const SCORE_MAX = Math.floor(100);

  if (debitAmt > creditAmt) {
    total = Number(`.${Number((debitAmt - creditAmt) / totalDays).toFixed(0)}`);
  }

  // score = clamp(total, SCORE_MIN, SCORE_MAX) * 100;
  score = Math.floor(Math.random() * (SCORE_MAX - SCORE_MIN) + SCORE_MIN);

  return {
    grade: grading(score),
    score,
    dates,
    balance,
  };
};

module.exports = {
  dateDiffInDays,
  clamp,
  grading,
  reduceData,
  calculateCredit,
};
