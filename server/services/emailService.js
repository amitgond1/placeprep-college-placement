const nodemailer = require('nodemailer');

const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 587;
const EMAIL_SECURE = EMAIL_PORT === 465;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_ENABLED = Boolean(EMAIL_USER && EMAIL_PASS);
const RETRYABLE_ERROR_SNIPPETS = ['timeout', 'timed out', 'ECONNECTION', 'ETIMEDOUT', 'socket'];

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const FROM = EMAIL_USER
  ? `PlacePrep <${EMAIL_USER}>`
  : (process.env.EMAIL_FROM || 'PlacePrep <noreply@placeprep.app>');

if (EMAIL_ENABLED) {
  transporter.verify()
    .then(() => console.log(`[email] SMTP ready on ${EMAIL_HOST}:${EMAIL_PORT}`))
    .catch((err) => console.error('[email] SMTP verify failed:', err.message));
} else {
  console.warn('[email] Disabled: EMAIL_USER / EMAIL_PASS missing');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryableMailError(error) {
  const message = String(error?.message || '').toLowerCase();
  return RETRYABLE_ERROR_SNIPPETS.some((snippet) => message.includes(snippet.toLowerCase()));
}

async function sendMailWithRetry(mailOptions, retries = 2) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !isRetryableMailError(error)) break;
      const waitMs = 800 * (attempt + 1);
      console.warn(`[email] retrying sendMail in ${waitMs}ms (${attempt + 1}/${retries})`);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

async function sendWelcomeEmail(user) {
  if (!EMAIL_ENABLED || !user?.email) return { sent: false, reason: 'email-disabled-or-missing-recipient' };

  const companies = user.targetCompanies?.join(', ') || 'Not set';

  await sendMailWithRetry({
    from: FROM,
    to: user.email,
    subject: `Welcome to PlacePrep, ${user.name}!`,
    html: `
    <!DOCTYPE html>
    <html>
    <head><style>
      body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #1a1a2e, #7c3aed); padding: 40px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 28px; }
      .header p { margin: 10px 0 0; opacity: 0.9; }
      .body { padding: 40px; }
      .stat { background: #f8fafc; border-radius: 12px; padding: 16px; margin: 12px 0; border-left: 4px solid #7c3aed; }
      .stat label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
      .stat value { display: block; font-size: 20px; font-weight: bold; color: #1a1a2e; margin-top: 4px; }
      .cta { text-align: center; margin: 32px 0; }
      .btn { background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; }
      .footer { padding: 20px 40px; text-align: center; color: #94a3b8; font-size: 14px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to PlacePrep!</h1>
          <p>Your placement journey starts today, ${user.name}!</p>
        </div>
        <div class="body">
          <p style="color:#334155;font-size:16px;">
            You have taken the first step towards landing your dream job. PlacePrep will guide you through
            every step of your campus placement journey.
          </p>
          ${user.targetPackage ? `
          <div class="stat">
            <label>Target Package</label>
            <value>${user.targetPackage} LPA</value>
          </div>` : ''}
          ${user.targetCompanies?.length ? `
          <div class="stat">
            <label>Target Companies</label>
            <value style="font-size:14px">${companies}</value>
          </div>` : ''}
          <div class="stat">
            <label>Your Journey</label>
            <value>DSA Practice + Mock Interviews + Resume Building</value>
          </div>
          <div class="cta">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="btn">
              Start Preparing Now
            </a>
          </div>
          <p style="color:#64748b;font-size:14px;text-align:center">
            Complete DSA daily goals, practice mock interviews, and build an ATS-optimized resume.
          </p>
        </div>
        <div class="footer">PlacePrep - Built for B.Tech students</div>
      </div>
    </body>
    </html>
    `,
    text: `Welcome to PlacePrep, ${user.name}! Start here: ${process.env.CLIENT_URL || 'http://localhost:5173'}`
  }, 2);

  return { sent: true };
}

async function sendDSAReminderEmail(user) {
  if (!EMAIL_ENABLED || !user.emailReminders) return;

  await sendMailWithRetry({
    from: FROM,
    to: user.email,
    subject: `PlacePrep Alert: Don't break your streak, ${user.name}!`,
    html: `
    <!DOCTYPE html>
    <html><head><style>
      body { font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #1a1a2e, #ef4444); padding: 32px; text-align: center; color: white; }
      .body { padding: 32px; text-align: center; }
      .streak { font-size: 64px; margin: 20px 0; }
      .btn { background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; }
    </style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Goal Not Met Yet!</h1>
        </div>
        <div class="body">
          <div class="streak">${user.currentStreak}</div>
          <h2>You have not solved your ${user.dailyGoal} problems today!</h2>
          <p style="color:#64748b">Do not break your ${user.currentStreak}-day streak. You are close to your daily goal.</p>
          <br/>
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dsa" class="btn">
            Solve Now
          </a>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px">You have until midnight to complete your daily goal.</p>
        </div>
      </div>
    </body></html>
    `
  }, 2);
}

async function sendWeeklyReport(user, stats) {
  if (!EMAIL_ENABLED || !user.weeklyReport) return;

  await sendMailWithRetry({
    from: FROM,
    to: user.email,
    subject: `Your Weekly PlacePrep Report - ${stats.problemsSolved} problems solved!`,
    html: `
    <!DOCTYPE html>
    <html><head><style>
      body { font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #7c3aed, #06b6d4); padding: 32px; text-align: center; color: white; }
      .stats { display: flex; padding: 0 24px; }
      .stat { flex: 1; text-align: center; padding: 24px 12px; }
      .stat .num { font-size: 36px; font-weight: bold; color: #7c3aed; }
      .stat .label { font-size: 13px; color: #64748b; margin-top: 4px; }
      .body { padding: 24px; }
      .btn { background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; }
    </style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Weekly Report</h1>
          <p>Here is how you did this week, ${user.name}!</p>
        </div>
        <div class="stats">
          <div class="stat"><div class="num">${stats.problemsSolved}</div><div class="label">Problems Solved</div></div>
          <div class="stat"><div class="num">${stats.mocksTaken}</div><div class="label">Mock Interviews</div></div>
          <div class="stat"><div class="num">${stats.atsScore || 'N/A'}</div><div class="label">ATS Score</div></div>
        </div>
        <div class="body" style="text-align:center">
          <p style="color:#334155">Streak: ${user.currentStreak} days | Total Solved: ${user.dsaSolvedTotal}</p>
          <br/>
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="btn">View Full Dashboard</a>
        </div>
      </div>
    </body></html>
    `
  }, 2);
}

async function sendStreakBrokenEmail(user) {
  if (!EMAIL_ENABLED || !user.emailReminders) return;

  await sendMailWithRetry({
    from: FROM,
    to: user.email,
    subject: `You broke your streak - Start again today, ${user.name}!`,
    html: `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
      <h2 style="color:#1a1a2e">Streak Broken</h2>
      <p>Your ${user.longestStreak}-day streak was broken. Do not let that stop you!</p>
      <p>Every champion has setbacks. Start fresh today and build an even bigger streak.</p>
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dsa"
         style="background:linear-gradient(135deg,#7c3aed,#06b6d4);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;display:inline-block">
        Start New Streak
      </a>
    </div>
    `
  }, 2);
}

module.exports = { sendWelcomeEmail, sendDSAReminderEmail, sendWeeklyReport, sendStreakBrokenEmail };
