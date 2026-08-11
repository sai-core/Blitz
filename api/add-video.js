const { getVideosFile, saveVideosFile } = require('./_lib/github');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { password, title, url, thumb } = req.body || {};

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Wrong password' });
    }
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and video URL are required' });
    }

    const { videos, sha } = await getVideosFile();

    const newVideo = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: title.trim(),
      url: url.trim(),
      thumb: (thumb || '').trim(),
      addedAt: new Date().toISOString()
    };

    videos.unshift(newVideo);
    await saveVideosFile(videos, sha, `Add video: ${newVideo.title}`);

    res.status(200).json({ success: true, video: newVideo });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
