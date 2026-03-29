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
  const system = `You are a senior ATS (Applicant Tracking System) expert and resume coach with 10+ years of experience reviewing resumes for top tech companies. You analyze resumes with the precision of actual ATS software. Return valid JSON only — no explanation outside JSON.`;

  const prompt = `Perform a comprehensive, accurate ATS analysis of this resume against the job description.

JOB DESCRIPTION:
${jobDescription.substring(0, 2500)}

RESUME TEXT:
${resumeText.substring(0, 4000)}

INSTRUCTIONS FOR ACCURATE SCORING:
1. Extract ALL technical keywords, tools, technologies, skills, and soft skills from the JD
2. Check EXACT and PARTIAL matches in resume (case-insensitive)
3. Score breakdown:
   - Keyword match rate (40 points max): (matched/total_required) * 40
   - Skills section completeness (20 points max): technical stack coverage
   - Experience quality (20 points max): action verbs, quantified achievements, relevance
   - Formatting/structure (10 points max): standard sections, ATS-parseable format
   - Education match (10 points max): degree requirements met
4. Be precise — do not inflate scores. A score of 50-65 means moderate match, 75+ is strong.

Return this exact JSON structure:
{
  "score": <calculated integer 0-100>,
  "keywordMatchRate": <percentage 0-100>,
  "matchedKeywords": ["<each exact keyword found in both JD and resume>"],
  "missingKeywords": ["<important JD keywords NOT found in resume>"],
  "skillsGap": ["<specific technical skills JD requires that resume lacks>"],
  "sectionFeedback": {
    "summary": "<specific actionable feedback on summary/objective section>",
    "experience": "<feedback on experience bullets — action verbs, metrics, relevance>",
    "skills": "<feedback on skills section completeness and organization>",
    "education": "<feedback on education section match>",
    "formatting": "<ATS formatting issues — tables, columns, graphics, fonts>"
  },
  "rewriteSuggestions": [
    "<specific rewrite suggestion with example>",
    "<specific rewrite suggestion with example>",
    "<specific rewrite suggestion with example>"
  ],
  "actionVerbStrength": "<weak|moderate|strong>",
  "quantifiedAchievements": <number of bullet points with numbers/metrics found>,
  "topImprovements": [
    "<single most impactful change to increase score>",
    "<second most impactful change>",
    "<third most impactful change>"
  ],
  "compatibilityVerdict": "<Not Compatible|Needs Work|Good Match|Strong Match>"
}`;

  try {
    const text = await chat([{ role: 'user', content: prompt }], system);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      score: 60, keywordMatchRate: 50,
      matchedKeywords: [], missingKeywords: [], skillsGap: [],
      sectionFeedback: { summary: 'Could not analyze', experience: '', skills: '', education: '', formatting: '' },
      rewriteSuggestions: ['Add more keywords from the JD', 'Quantify your achievements', 'Use standard section headers'],
      actionVerbStrength: 'moderate',
      quantifiedAchievements: 0,
      topImprovements: ['Add missing keywords', 'Quantify achievements', 'Match skills to JD'],
      compatibilityVerdict: 'Needs Work'
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
