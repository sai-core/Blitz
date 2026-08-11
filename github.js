// Shared helper: reads/writes videos.json directly in your GitHub repo
// using the GitHub Contents API. Runs server-side only (Vercel function),
// so the token never reaches the browser.

const OWNER  = process.env.GITHUB_OWNER;
const REPO   = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const TOKEN  = process.env.GITHUB_TOKEN;
const PATH   = process.env.JSON_PATH || 'videos.json';

function apiUrl() {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
}

async function getVideosFile() {
  const res = await fetch(`${apiUrl()}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  });

  if (res.status === 404) {
    // File doesn't exist yet in the repo — treat as empty list
    return { videos: [], sha: null };
  }
  if (!res.ok) {
    throw new Error(`GitHub GET failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const raw = Buffer.from(data.content, 'base64').toString('utf-8');
  let videos = [];
  try { videos = JSON.parse(raw); } catch { videos = []; }
  return { videos, sha: data.sha };
}

async function saveVideosFile(videos, sha, message) {
  const content = Buffer.from(JSON.stringify(videos, null, 2)).toString('base64');
  const body = {
    message: message || 'Update videos.json',
    content,
    branch: BRANCH
  };
  if (sha) body.sha = sha; // required when updating an existing file

  const res = await fetch(apiUrl(), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`GitHub PUT failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

module.exports = { getVideosFile, saveVideosFile };
