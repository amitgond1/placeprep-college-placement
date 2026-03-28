const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || '';

const LANG_IDS = { cpp: 76, java: 62, python: 71 };

const STATUS = {
  1: 'In Queue', 2: 'Processing', 3: 'Accepted', 4: 'Wrong Answer',
  5: 'Time Limit Exceeded', 6: 'Compilation Error', 7: 'Runtime Error',
  8: 'Runtime Error', 9: 'Runtime Error', 10: 'Runtime Error',
  11: 'Runtime Error', 12: 'Runtime Error', 13: 'Internal Error', 14: 'Exec Format Error'
};

async function runCode({ code, language, stdin = '', expectedOutput = '' }) {
  const langId = LANG_IDS[language] || 71;

  try {
    const headers = { 'Content-Type': 'application/json', 'X-Auth-Token': 'guest' };
    if (JUDGE0_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_KEY;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    // Use free public Judge0 instance
    const baseUrl = JUDGE0_KEY ? JUDGE0_URL : 'https://ce.judge0.com';

    const response = await axios.post(
      `${baseUrl}/submissions?base64_encoded=false&wait=true`,
      { source_code: code, language_id: langId, stdin, expected_output: expectedOutput },
      { headers, timeout: 20000 }
    );

    const data = response.data;
    const statusId = data.status?.id || 0;

    return {
      statusId,
      statusDesc: STATUS[statusId] || data.status?.description || 'Unknown',
      stdout: (data.stdout || '').trim(),
      stderr: (data.stderr || '').trim(),
      compileOutput: (data.compile_output || '').trim(),
      time: parseFloat(data.time) || 0,
      memory: data.memory || 0,
      accepted: statusId === 3,
      wrongAnswer: statusId === 4,
      tle: statusId === 5,
      compileError: statusId === 6,
      runtimeError: statusId >= 7 && statusId <= 12
    };
  } catch (err) {
    // Fallback: simulate response if Judge0 is down
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.response?.status === 429) {
      return {
        statusId: 0,
        statusDesc: 'Judge Unavailable',
        stdout: '',
        stderr: 'Code execution service temporarily unavailable. Please try again.',
        compileOutput: '',
        time: 0,
        memory: 0,
        accepted: false,
        judgeError: true
      };
    }
    throw err;
  }
}

module.exports = { runCode, LANG_IDS, STATUS };
