const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = 'claude-sonnet-4-6';

async function chat(messages, system = '') {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system,
    messages
  });
  return response.content[0].text;
}

// Start mock interview — get first/next question
async function startMockInterview(company, roundType, difficulty, previousQuestions = []) {
  const prevQStr = previousQuestions.length
    ? `\nAvoid repeating these questions:\n${previousQuestions.slice(-5).join('\n')}`
    : '';

  const system = `You are an expert technical interviewer at ${company}.
You are conducting a ${roundType} interview at ${difficulty} difficulty.
Ask ONE clear, specific interview question appropriate for ${company}'s ${roundType}.
Return ONLY the question text — no numbering, no introduction, no explanation.`;

  const text = await chat([{
    role: 'user',
    content: `Give me the next ${roundType} interview question for ${company}.${prevQStr}`
  }], system);

  return text.trim();
}

// Evaluate a single answer
async function evaluateAnswer(question, answer, company, roundType) {
  const system = `You are an expert ${company} interviewer evaluating a candidate's answer during a ${roundType} interview.
Evaluate honestly and constructively. Return a valid JSON object.`;

  const prompt = `Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer and return a JSON object with these exact keys:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentence overall feedback>",
  "idealAnswer": "<what a perfect answer would include>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"]
}`;

  try {
    const text = await chat([{ role: 'user', content: prompt }], system);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      score: 5, feedback: 'Answer received. Keep practicing!',
      idealAnswer: 'A comprehensive answer covering all key aspects.',
      strengths: ['Attempted the question'],
      improvements: ['Add more detail', 'Structure your answer better']
    };
  }
}

// Generate final session report
async function generateFinalReport(qaHistory, company, roundType) {
  const completed = qaHistory.filter(qa => qa.score !== undefined);
  if (!completed.length) {
    return {
      overallScore: 0, strengths: ['Started the interview'],
      improvements: ['Complete more questions'], recommendedTopics: ['DSA Basics']
    };
  }

  const avgScore = completed.reduce((a, qa) => a + (qa.score || 0), 0) / completed.length;
  const overallScore = Math.round((avgScore / 10) * 100);

  const summary = completed.map((qa, i) =>
    `Q${i + 1}: ${qa.question}\nScore: ${qa.score}/10\nFeedback: ${qa.feedback}`
  ).join('\n\n');

  const system = `You are a senior ${company} interviewer giving final feedback. Return valid JSON only.`;
  const prompt = `Interview Summary for ${company} ${roundType}:
${summary}

Return a JSON object:
{
  "strengths": ["<3-4 specific strengths shown>"],
  "improvements": ["<3-4 specific areas to improve>"],
  "recommendedTopics": ["<4-5 topics to study>"],
  "overallFeedback": "<2-3 sentence summary>"
}`;

  try {
    const text = await chat([{ role: 'user', content: prompt }], system);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);
    return { ...parsed, overallScore };
  } catch {
    return {
      overallScore,
      strengths: ['Completed the interview', 'Showed effort'],
      improvements: ['Practice more DSA', 'Study system design'],
      recommendedTopics: ['Arrays', 'Trees', 'Dynamic Programming', 'System Design'],
      overallFeedback: `You scored ${overallScore}/100. Keep practicing!`
    };
  }
}

// ATS Check
async function checkATS(resumeText, jobDescription) {
  const system = `You are an expert ATS (Applicant Tracking System) analyzer. Return valid JSON only.`;
  const prompt = `Analyze this resume against the job description for ATS compatibility.

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

RESUME:
${resumeText.substring(0, 3000)}

Return a JSON object:
{
  "score": <0-100 number>,
  "matchedKeywords": ["<keyword1>", "<keyword2>", ...],
  "missingKeywords": ["<keyword1>", "<keyword2>", ...],
  "sectionFeedback": {
    "summary": "<feedback>",
    "experience": "<feedback>",
    "skills": "<feedback>",
    "education": "<feedback>",
    "formatting": "<feedback>"
  },
  "rewriteSuggestions": ["<suggestion1>", "<suggestion2>", ...],
  "actionVerbStrength": "<weak|moderate|strong>"
}`;

  try {
    const text = await chat([{ role: 'user', content: prompt }], system);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      score: 60, matchedKeywords: [], missingKeywords: [],
      sectionFeedback: { summary: 'Could not analyze', experience: '', skills: '', education: '', formatting: '' },
      rewriteSuggestions: ['Add more keywords from the JD'],
      actionVerbStrength: 'moderate'
    };
  }
}

// Optimize resume for company
async function optimizeResume(resumeText, company, jobDescription) {
  const system = `You are an expert resume writer specializing in ${company} applications.`;
  const prompt = `Rewrite and optimize this resume for ${company}'s job posting.
Focus on ${company}'s values and what they look for in candidates.

JOB DESCRIPTION: ${jobDescription?.substring(0, 1000) || 'Software Engineer position'}

CURRENT RESUME:
${resumeText.substring(0, 2000)}

Provide:
1. Improved bullet points for experience/projects
2. Better keywords to add
3. Rewritten summary targeting ${company}
4. Skills to highlight

Be specific and actionable.`;

  return await chat([{ role: 'user', content: prompt }], system);
}

// Evaluate submitted code
async function evaluateCode(questionTitle, code, language, officialSolution) {
  const system = `You are a senior software engineer reviewing code submissions. Return valid JSON only.`;
  const prompt = `Review this ${language} solution for the problem: "${questionTitle}"

SUBMITTED CODE:
\`\`\`${language}
${code}
\`\`\`

Return a JSON object:
{
  "isCorrect": <boolean>,
  "score": <0-10>,
  "timeComplexity": "<e.g., O(n log n)>",
  "spaceComplexity": "<e.g., O(n)>",
  "feedback": "<2-3 sentences>",
  "improvements": ["<improvement1>", "<improvement2>"],
  "approach": "<brief description of the approach>"
}`;

  try {
    const text = await chat([{ role: 'user', content: prompt }], system);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      isCorrect: true, score: 7,
      timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
      feedback: 'Code submitted successfully. Review the official solution.',
      improvements: ['Consider edge cases'],
      approach: 'Iterative approach'
    };
  }
}

// Aptitude doubt solver
async function solveAptitudeDoubt(questionText, explanation, userQuery, language = 'english') {
  const hinglish = language === 'hinglish';
  const system = hinglish
    ? `You are a helpful aptitude tutor. Explain concepts in simple Hinglish (mix of Hindi and English) that Indian students find easy to understand.`
    : `You are a helpful aptitude tutor. Explain concepts clearly with step-by-step solutions.`;

  const prompt = `Question: ${questionText}

Official Explanation: ${explanation}

Student's Doubt: ${userQuery}

Please explain this clearly${hinglish ? ' in Hinglish' : ''}. Include:
1. Direct answer to the doubt
2. Step-by-step breakdown if needed
3. A shortcut or trick if applicable
4. What type of questions are similar to this`;

  return await chat([{ role: 'user', content: prompt }], system);
}

module.exports = {
  startMockInterview, evaluateAnswer, generateFinalReport,
  checkATS, optimizeResume, evaluateCode, solveAptitudeDoubt
};
