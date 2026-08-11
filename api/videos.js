const { getVideosFile } = require('./_lib/github');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { videos } = await getVideosFile();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(videos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
