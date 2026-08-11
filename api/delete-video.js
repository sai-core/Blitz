const { getVideosFile, saveVideosFile } = require('./_lib/github');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { password, id } = req.body || {};

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Wrong password' });
    }
    if (!id) {
      return res.status(400).json({ error: 'id required' });
    }

    const { videos, sha } = await getVideosFile();
    const filtered = videos.filter(v => v.id !== id);

    if (filtered.length === videos.length) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await saveVideosFile(filtered, sha, `Delete video: ${id}`);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
