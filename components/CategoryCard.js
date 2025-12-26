// CategoryCard 组件：用于在首页展示分类卡片
import { useRouter } from 'next/router';

export default function CategoryCard({ category, count = 0 }) {
  const router = useRouter();
  
  // 优先使用从Notion获取的分类统计数量，如果没有则使用传入的count参数
  const displayCount = category.count !== undefined ? category.count : count;
  const title = category.name || category.properties?.Name?.title[0]?.plain_text || '未命名';
  
  const handleClick = () => {
    // 使用分类的ID（英文标识符）进行导航
    router.push(`/?category=${encodeURIComponent(category.id)}`);
  };

  return (
    <div 
      className="glass-card category-compact flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(90deg,var(--anime-accent-2),var(--anime-accent-1))'}}>
          <i className="fas fa-folder text-white"></i>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-black truncate">{title}</h3>
          <p className="text-[12px] text-black/70 mt-0.5 truncate">{`${displayCount} 个网站`}</p>
        </div>
      </div>

      <div className="ml-3 flex-shrink-0">
        <span className="pill">{displayCount}</span>
      </div>
    </div>
  );
}