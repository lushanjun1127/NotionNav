// LinkCard 组件：展示单个链接条目（名称、类型或描述、跳转链接）
import { useState, useEffect } from 'react';

export default function LinkCard({ link }) {
  const title = link.name || link.properties?.Name?.title?.[0]?.plain_text || '未命名';
  const href = link.href || link.properties?.URL?.url || link.url || '#';
  const desc = link.description || link.properties?.Description?.rich_text?.[0]?.plain_text || '';
  const categoryName = link.categoryName || '';
  const pinned = !!link.pinned;

  const [isError, setIsError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [href]);

  const handleClick = (e) => {
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      return;
    }

    // 验证链接格式
    try {
      new URL(href);
    } catch (error) {
      console.error(`无效的链接格式: ${href}`, error);
      setIsError(true);
      e.preventDefault();
      return;
    }

    // 记录点击事件（可以发送到API进行统计）
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId: link.id, url: href }),
    }).catch(error => console.error('记录点击失败:', error));

    // 打开链接
    window.open(href, '_blank', 'noopener,noreferrer');
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
    }
  };

  if (isError) {
    return (
      <div 
        className="relative glass-card link-compact compact-card opacity-70"
        role="alert"
        aria-label="无效链接"
      >
        <div className="flex items-start gap-3 w-full">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(90deg,var(--anime-accent-2),var(--anime-accent-1))'}}>
            <i className="fas fa-exclamation-triangle text-white"></i>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-black truncate">{title}</div>
            <div className="text-[12px] text-red-500 mt-1">无效链接</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a 
      href={href} 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      target="_blank" 
      rel="noopener noreferrer" 
      className={`relative glass-card card-hover link-compact compact-card transition-all duration-200 ${
        isHovered ? 'shadow-lg transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`访问 ${title} - ${desc || '无描述'}`}
      tabIndex={0}
    >
      {pinned && (
        <span className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 text-[11px] font-medium pill-accent">
          置顶
        </span>
      )}

      <div className="flex items-start gap-3 w-full">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(90deg,var(--anime-accent-2),var(--anime-accent-1))'}}>
          <i className="fas fa-link text-white"></i>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-black truncate">{title}</div>
              <div className="text-[12px] text-black/70 mt-1 line-clamp-2">{desc}</div>
            </div>
            {categoryName && <div className="ml-3 flex-shrink-0"><span className="pill">{categoryName}</span></div>}
          </div>

          {Array.isArray(link.tags) && link.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {link.tags.map((t, i) => (
                <span key={i} className="pill text-[10px] px-2">
                  {t}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>
    </a>
  );
}