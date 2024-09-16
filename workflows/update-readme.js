const fs = require('fs');
const axios = require('axios');

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';
const LEETCODE_USERNAME = 'MOHAMMED_RIMSHAN';

async function fetchLeetCodeStreak() {
  const query = `
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          streak
        }
      }
    }
  `;

  try {
    const response = await axios.post(LEETCODE_API_ENDPOINT, {
      query,
      variables: { username: LEETCODE_USERNAME }
    });

    return response.data.data.matchedUser.userCalendar.streak;
  } catch (error) {
    console.error('Error fetching LeetCode streak:', error);
    return null;
  }
}

async function updateReadme() {
  const streak = await fetchLeetCodeStreak();
  if (streak === null) return;

  const readmePath = 'README.md';
  let readmeContent = fs.readFileSync(readmePath, 'utf8');

  const leetCodeSection = `## My LeetCode Streak\n\n🔥 Current streak: ${streak} days`;

  if (readmeContent.includes('## My LeetCode Streak')) {
    readmeContent = readmeContent.replace(/## My LeetCode Streak[\s\S]*?(?=\n##|$)/, leetCodeSection);
  } else {
    readmeContent += `\n\n${leetCodeSection}`;
  }

  fs.writeFileSync(readmePath, readmeContent);
}

updateReadme();
