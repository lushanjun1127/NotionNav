import { getAllData } from '../../lib/notion';

export default async function handler(req, res) {
  try {
    const page = parseInt(req.query.page || '1', 10) || 1;
    const pageSize = parseInt(req.query.pageSize || '20', 10) || 20;
    const category = req.query.category || null;

    const { links } = await getAllData();
    let list = links;
    if (category) list = list.filter((l) => String(l.categoryId) === String(category));

    const total = list.length;
    const start = (page - 1) * pageSize;
    const paged = list.slice(start, start + pageSize);

    res.status(200).json({ ok: true, total, page, pageSize, results: paged });
  } catch (error) {
    console.error('links api error', error);
    res.status(500).json({ error: String(error) });
  }
}
