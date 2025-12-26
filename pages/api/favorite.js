import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'tmp', 'favorites.json');

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}), 'utf-8');
}

function getVisitorId(req, res) {
  // 尝试从 cookie 中读取 visitorId；若无则生成并设置
  const cookies = req.cookies || {};
  let vid = cookies.visitorId;
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).slice(2, 10);
    // 设置短期 cookie
    res.setHeader('Set-Cookie', `visitorId=${vid}; Path=/; HttpOnly`);
  }
  return vid;
}

export default function handler(req, res) {
  ensureDb();
  if (req.method === 'POST') {
    try {
      const { linkId } = req.body || {};
      if (!linkId) return res.status(400).json({ error: 'missing linkId' });

      const vid = getVisitorId(req, res);

      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const db = JSON.parse(raw || '{}');
      const userSet = new Set(db[vid] || []);

      let isFav;
      if (userSet.has(linkId)) {
        userSet.delete(linkId);
        isFav = false;
      } else {
        userSet.add(linkId);
        isFav = true;
      }

      db[vid] = Array.from(userSet);
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

      return res.status(200).json({ ok: true, isFav });
    } catch (error) {
      console.error('favorite error', error);
      return res.status(500).json({ error: String(error) });
    }
  }

  if (req.method === 'GET') {
    try {
      const vid = getVisitorId(req, res);
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const db = JSON.parse(raw || '{}');
      const list = db[vid] || [];
      return res.status(200).json({ ok: true, list });
    } catch (error) {
      console.error('favorite read error', error);
      return res.status(500).json({ error: String(error) });
    }
  }

  res.setHeader('Allow', 'GET,POST');
  return res.status(405).end();
}
