import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'tmp', 'errors.log');

function ensureDir() {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export default function handler(req, res) {
  ensureDir();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const payload = {
      time: new Date().toISOString(),
      ...req.body,
      ua: req.headers['user-agent'] || null,
    };
    fs.appendFileSync(LOG_PATH, JSON.stringify(payload) + '\n');
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('log api error', error);
    res.status(500).json({ error: String(error) });
  }
}
