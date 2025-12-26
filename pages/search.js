import { Header } from '../components';
import LinkCard from '../components/LinkCard';
import CategoryCard from '../components/CategoryCard';
import { getAllData } from '../lib/notion';

export default function SearchPage({ query, results, total, page, pageSize }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">搜索: "{query}"</h1>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">结果（{total}）</h2>
          <div className="site-grid-tight">
            {results.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </section>

        <div className="mt-6 flex items-center justify-center space-x-4">
          {page > 1 && (
            <a href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}&pageSize=${pageSize}`} className="px-3 py-1 glass-card">上一页</a>
          )}
          {total > page * pageSize && (
            <a href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}&pageSize=${pageSize}`} className="px-3 py-1 glass-card">下一页</a>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const q = context.query.q || context.query.search || '';
  const page = parseInt(context.query.page || '1', 10) || 1;
  const pageSize = parseInt(context.query.pageSize || '20', 10) || 20;

  try {
    const { links } = await getAllData();

    const normalizedQ = q.trim().toLowerCase();
    let matched = links;
    if (normalizedQ) {
      matched = links.filter((l) => {
        const title = (l.name || '').toLowerCase();
        const desc = (l.description || '').toLowerCase();
        const cat = (l.categoryName || '').toLowerCase();
        return title.includes(normalizedQ) || desc.includes(normalizedQ) || cat.includes(normalizedQ);
      });
    }

    const total = matched.length;
    const start = (page - 1) * pageSize;
    const paged = matched.slice(start, start + pageSize);

    return {
      props: {
        query: q,
        results: paged,
        total,
        page,
        pageSize,
      },
    };
  } catch (error) {
    return {
      props: {
        query: q,
        results: [],
        total: 0,
        page,
        pageSize,
        error: error.message || String(error),
      },
    };
  }
}
