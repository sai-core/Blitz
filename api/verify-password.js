// Verifies the admin password against the env var.
// Returns { ok: true } on match, { error: 'Wrong password' } otherwise.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { password } = req.body || {};
    if (typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'Password required' });
    }
    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'ADMIN_PASSWORD env var not set' });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Wrong password' });
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
