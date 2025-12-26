export default function SkeletonCard({ compact = false }) {
  return (
    <div className={`glass-card ${compact ? 'category-compact' : 'link-compact'} animate-pulse`}>
      <div className="flex items-start gap-3 w-full">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(255,255,255,0.04)]"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-[rgba(255,255,255,0.03)] rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-[rgba(255,255,255,0.02)] rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
