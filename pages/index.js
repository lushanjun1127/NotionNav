// 首页：使用模块化核心框架
import { getCategories, getLinksByCategory, searchLinks } from '../lib/notion';
import { Header, CategoryCard, LinkCard } from '../components';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { globalSearch, advancedSearch, getSuggestions } from '../core/search-engine';

export default function Home({ categories, linksByCategory, error }) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // 将所有链接扁平化，用于搜索
  const allLinks = useMemo(() => Object.values(linksByCategory).flat(), [linksByCategory]);
  
  // 检查是否有搜索查询或分类过滤
  useEffect(() => {
    if (router.query.search) {
      const query = router.query.search;
      const { categories: filteredCats, links: filteredLinks } = 
        globalSearch(query, categories, allLinks);
      
      setSearchResults({
        categories: filteredCats,
        links: filteredLinks
      });
      setSelectedCategory(null); // 重置分类选择
    } else if (router.query.category) {
      // 过滤特定分类 - 使用英文标识符
      const categoryId = router.query.category;
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        setSelectedCategory(category);
        setSearchResults(null);
      }
    } else {
      // 没有搜索或分类过滤，重置
      setSearchResults(null);
      setSelectedCategory(null);
    }
  }, [router.query.search, router.query.category, categories, allLinks]);

  // 监听侧边栏搜索变化
  useEffect(() => {
    if (sidebarSearch.trim() === '') {
      setFilteredCategories(categories);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = categories.filter(c => 
        c.name.toLowerCase().includes(sidebarSearch.toLowerCase())
      );
      setFilteredCategories(filtered);
      
      // 获取搜索建议
      const suggestions = getSuggestions(sidebarSearch, allLinks, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    }
  }, [sidebarSearch, categories, allLinks]);

  // 处理建议点击
  const handleSuggestionClick = useCallback((suggestion) => {
    setSidebarSearch(suggestion);
    setShowSuggestions(false);
    router.push(`/?search=${encodeURIComponent(suggestion)}`);
  }, [router]);

  // 处理键盘事件
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-black">WebNav - 专业网址导航</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">错误: </strong>
            <span className="block sm:inline">无法从Notion获取数据: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  // 如果有搜索结果，则显示搜索结果
  if (router.query.search && searchResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-black">搜索结果: "{router.query.search}"</h1>
              <button 
                className="text-sm px-3 py-1 bg-pink-200 rounded text-black"
                onClick={() => router.push('/')}
              >
                返回首页
              </button>
            </div>
            
            {searchResults.categories.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-black">分类</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.categories.map((c) => (
                    <CategoryCard key={c.id} category={c} count={linksByCategory[c.id]?.length || 0} />
                  ))}
                </div>
              </section>
            )}
            
            {searchResults.links.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3 text-black">网站链接</h2>
                <div className="site-grid-tight">
                  {searchResults.links.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              </section>
            )}
            
            {searchResults.categories.length === 0 && searchResults.links.length === 0 && (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium text-black">没有找到匹配的结果</h3>
                <p className="text-gray-500 mt-2">尝试使用其他关键词搜索</p>
              </div>
            )}
          </div>
        </main>
        <footer className="bg-pink-50 border-t border-pink-200 py-6 mt-8 text-center text-sm text-black/50">
          &copy; 2025 WebNav. 基于 NotionNext 架构设计。
        </footer>
      </div>
    );
  }

  // 如果选择了特定分类，则只显示该分类的链接
  if (selectedCategory && !router.query.search) {
    const categoryLinks = linksByCategory[selectedCategory.id] || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-black">分类: {selectedCategory.name}</h1>
              <button 
                className="text-sm px-3 py-1 bg-pink-200 rounded text-black"
                onClick={() => router.push('/')}
              >
                返回首页
              </button>
            </div>
            
            {categoryLinks.length > 0 ? (
              <section>
                <div className="site-grid-tight">
                  {categoryLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              </section>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium text-black">该分类下没有网站</h3>
                <p className="text-gray-500 mt-2">此分类暂无链接数据</p>
              </div>
            )}
          </div>
        </main>
        <footer className="bg-pink-50 border-t border-pink-200 py-6 mt-8 text-center text-sm text-black/50">
          &copy; 2025 WebNav. 基于 NotionNext 架构设计。
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="two-col">
          {/* 左侧：菜单栏（搜索 + 分类列表） */}
          <aside className="left-menu">
            <div className="glass-card p-3 relative">
              <div className="search relative">
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  onFocus={() => sidebarSearch && setShowSuggestions(true)}
                  placeholder="搜索分类或网站..."
                  className="w-full px-3 py-2 rounded-md bg-pink-100 text-black/90 focus:outline-none"
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-pink-200 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-left hover:bg-pink-100 cursor-pointer text-black"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <button 
                  className="text-sm px-3 py-1 bg-pink-200 rounded text-black"
                  onClick={() => {
                    setSidebarSearch('');
                    setFilteredCategories(categories);
                    router.push('/');
                  }}
                >
                  展示全部
                </button>
              </div>
            </div>

            <div className="mt-4 categories-list">
              {filteredCategories.map((c) => (
                <CategoryCard key={c.id} category={c} count={linksByCategory[c.id]?.length || 0} />
              ))}
            </div>
          </aside>

          {/* 中间主内容：导航数据 */}
          <section className="center-main">
            {categories.map((category) => (
              <section key={category.id} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-black">
                    {category.name || category.properties?.Name?.title[0]?.plain_text || '未命名'}
                  </h2>
                  <span className="text-sm text-black/60">
                    {linksByCategory[category.id]?.length || 0} 个链接
                  </span>
                </div>

                <div className="site-grid-tight">
                  {linksByCategory[category.id]?.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              </section>
            ))}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pink-50 border-t border-pink-200 py-6 mt-8 text-center text-sm text-black/50">
        &copy; 2025 WebNav. 基于 NotionNext 架构设计。
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const categories = await getCategories();
    const linksByCategory = {};
    
    if (Array.isArray(categories) && categories.length > 0) {
      const results = await Promise.all(
        categories.map(async (category) => ({
          id: category.id, // 使用英文标识符作为ID
          links: await getLinksByCategory(category.id),
        }))
      );
      for (const r of results) {
        linksByCategory[r.id] = r.links || [];
      }
    }

    return {
      props: {
        categories,
        linksByCategory,
      },
      revalidate: 60, // 每60秒重新生成页面
    };
  } catch (error) {
    console.error('获取数据失败:', error);
    return {
      props: {
        categories: [],
        linksByCategory: {},
        error: error.message || '未知错误',
      },
      revalidate: 60,
    };
  }
}