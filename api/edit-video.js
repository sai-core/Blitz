const { getVideosFile, saveVideosFile } = require('./_lib/github');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { password, id, title, url, thumb, actor } = req.body || {};

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Wrong password' });
    }
    if (!id) {
      return res.status(400).json({ error: 'id required' });
    }
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and video URL are required' });
    }

    const { videos, sha } = await getVideosFile();
    const idx = videos.findIndex(v => v.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Video not found' });
    }

    videos[idx] = {
      ...videos[idx],
      title: title.trim(),
      url: url.trim(),
      thumb: (thumb || '').trim(),
      actor: (actor || '').trim(),
      updatedAt: new Date().toISOString()
    };

    await saveVideosFile(videos, sha, `Edit video: ${videos[idx].title}`);

    res.status(200).json({ success: true, video: videos[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
