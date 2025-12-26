import fs from 'fs';
import path from 'path';
import { getAllData } from '../../lib/notion';

const CLICKS = path.join(process.cwd(), 'tmp', 'clicks.json');
const FAVS = path.join(process.cwd(), 'tmp', 'favorites.json');

function safeRead(file) {
  try {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf-8') || '{}');
  } catch (e) {
    return {};
  }
}

export default async function handler(req, res) {
  try {
    const { links } = await getAllData();
    const clicks = safeRead(CLICKS);
    const favs = safeRead(FAVS);

    // 计算每个 link 的总收藏数
    const favCount = {};
    Object.values(favs).forEach((arr) => {
      (arr || []).forEach((id) => { favCount[id] = (favCount[id] || 0) + 1; });
    });

    // 简单评分: 点击数 * 1 + 收藏数 * 3
    const scored = links.map((l) => ({
      ...l,
      score: (clicks[l.id] || 0) * 1 + (favCount[l.id] || 0) * 3,
    }));

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, parseInt(req.query.limit || '12', 10));
    res.status(200).json({ ok: true, results: top });
  } catch (error) {
    console.error('recommend error', error);
    res.status(500).json({ error: String(error) });
  }
}
