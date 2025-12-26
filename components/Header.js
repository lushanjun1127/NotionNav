// Header 组件：页面顶部导航栏
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { initTheme, getCurrentTheme, toggleTheme } from '../core/theme-manager';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTheme, setCurrentTheme] = useState('light');
  const router = useRouter();

  // 初始化主题并更新状态
  useEffect(() => {
    initTheme();
    setCurrentTheme(getCurrentTheme());
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
  };

  const handleKeyDown = (e) => {
    // 全局快捷键：/ 聚焦搜索
    if (e.key === '/' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      const searchInput = document.querySelector('input[placeholder*="搜索"]');
      if (searchInput) {
        searchInput.focus();
      }
    }
    // ESC键取消搜索
    else if (e.key === 'Escape') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'INPUT') {
        activeElement.blur();
        setSearchQuery('');
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-pink-100 border-b border-pink-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center" 
              style={{background: 'linear-gradient(90deg,var(--anime-accent-2),var(--anime-accent-1))'}}
            >
              <i className="fas fa-compass text-white"></i>
            </div>
            <h1 className="text-lg font-semibold text-black">WebNav</h1>
          </div>

          <div className="hidden lg:flex items-center flex-1 justify-center max-w-2xl px-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-pink-100 border border-pink-300 text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-shadow"
                placeholder="搜索网站、分类或关键词... (/ 搜索)"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/60">
                <i className="fas fa-search"></i>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="p-2 rounded-full hover:bg-pink-100 transition-colors"
              onClick={handleThemeToggle}
              aria-label={`切换到${currentTheme === 'light' ? '暗色' : '亮色'}主题`}
            >
              {currentTheme === 'light' ? (
                <i className="fas fa-moon text-black/80"></i>
              ) : (
                <i className="fas fa-sun text-black/80"></i>
              )}
            </button>
            <a href="/admin/categories" className="p-2 rounded-full hover:bg-pink-100 transition-colors" aria-label="管理面板">
              <i className="fas fa-cog text-black/80"></i>
            </a>
            <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-sm text-black/90" aria-label="用户头像">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}