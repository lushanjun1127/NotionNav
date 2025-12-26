import { useRouter } from 'next/router';
import { getFullPageContent } from '../../../lib/notion';
import NotionContent from '../../../components/NotionContent';
import Header from '../../../components/Header';

export default function NotionPage({ recordMap, error }) {
  const router = useRouter();
  const { id } = router.query;

  if (router.isFallback) {
    return <div>加载中...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button 
                onClick={() => router.back()} 
                className="px-4 py-2 bg-pink-200 text-black rounded hover:bg-pink-300 transition-colors"
              >
                返回
              </button>
            </div>
            <div className="text-red-500">错误: {error}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 bg-pink-200 text-black rounded hover:bg-pink-300 transition-colors"
            >
              返回
            </button>
          </div>
          <NotionContent recordMap={recordMap} />
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  
  try {
    const recordMap = await getFullPageContent(id);
    
    return {
      props: {
        recordMap: recordMap || null,
      },
    };
  } catch (error) {
    console.error('获取页面内容失败:', error);
    
    return {
      props: {
        recordMap: null,
        error: error.message || '未知错误',
      },
    };
  }
}