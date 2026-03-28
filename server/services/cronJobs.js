const cron = require('node-cron');
const User = require('../models/User');
const MockSession = require('../models/MockSession');
const { sendDSAReminderEmail, sendWeeklyReport, sendStreakBrokenEmail } = require('./emailService');

// Daily DSA reminder — 11:30 PM IST (18:00 UTC)
cron.schedule('0 18 * * *', async () => {
  console.log('[CRON] Running daily DSA reminder check...');
  try {
    const users = await User.find({ emailReminders: true, isOnboarded: true });
    for (const user of users) {
      if (user.dsaSolvedToday < user.dailyGoal) {
        await sendDSAReminderEmail(user).catch(console.error);
      }
    }
  } catch (err) {
    console.error('[CRON] DSA reminder error:', err.message);
  }
});

// Reset daily counter at midnight IST (18:30 UTC previous day)
cron.schedule('30 18 * * *', async () => {
  console.log('[CRON] Resetting daily DSA counters...');
  try {
    // Check for broken streaks before resetting
    const users = await User.find({ isOnboarded: true });
    for (const user of users) {
      if (user.lastSolvedDate) {
        const last = new Date(user.lastSolvedDate);
        last.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = (today - last) / (1000 * 60 * 60 * 24);
        if (diff > 1 && user.currentStreak > 0) {
          const prevStreak = user.currentStreak;
          user.longestStreak = Math.max(user.longestStreak, prevStreak);
          user.currentStreak = 0;
          await user.save();
          await sendStreakBrokenEmail(user).catch(console.error);
        }
      }
    }
    // Reset today's count
    await User.updateMany({}, { dsaSolvedToday: 0 });
  } catch (err) {
    console.error('[CRON] Daily reset error:', err.message);
  }
});

// Reset weekly counter every Monday midnight IST
cron.schedule('0 18 * * 0', async () => {
  console.log('[CRON] Resetting weekly DSA counters...');
  try {
    await User.updateMany({}, { dsaSolvedWeek: 0 });
  } catch (err) {
    console.error('[CRON] Weekly reset error:', err.message);
  }
});

// Weekly progress report — Sunday 9 PM IST (15:30 UTC)
cron.schedule('30 15 * * 0', async () => {
  console.log('[CRON] Sending weekly progress reports...');
  try {
    const users = await User.find({ weeklyReport: true, isOnboarded: true });
    for (const user of users) {
      const mocks = await MockSession.find({
        user: user._id,
        completed: true,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
      await sendWeeklyReport(user, {
        problemsSolved: user.dsaSolvedWeek,
        mocksTaken: mocks.length,
        atsScore: null
      }).catch(console.error);
    }
  } catch (err) {
    console.error('[CRON] Weekly report error:', err.message);
  }
});

// LeetCode sync — every 6 hours
cron.schedule('0 */6 * * *', async () => {
  try {
    const users = await User.find({ leetcodeUsername: { $ne: '' } }).limit(50);
    for (const user of users) {
      try {
        const axios = require('axios');
        const query = `{ matchedUser(username: "${user.leetcodeUsername}") { submitStats { acSubmissionNum { difficulty count } } } }`;
        const res = await axios.post('https://leetcode.com/graphql', { query }, {
          headers: { 'Content-Type': 'application/json' }, timeout: 10000
        });
        const stats = res.data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
        const total = stats.find(s => s.difficulty === 'All')?.count || 0;
        await User.findByIdAndUpdate(user._id, { leetcodeSolved: total });
      } catch { /* skip this user */ }
    }
  } catch (err) {
    console.error('[CRON] LeetCode sync error:', err.message);
  }
});

console.log('[CRON] All cron jobs scheduled');
