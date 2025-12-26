// 核心框架：搜索引擎模块

// 模糊匹配函数
const fuzzyMatch = (text, query) => {
  if (!text || !query) return false;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // 精确匹配优先
  if (lowerText.includes(lowerQuery)) return true;
  
  // 模糊匹配
  let queryIdx = 0;
  for (let i = 0; i < lowerText.length && queryIdx < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIdx]) {
      queryIdx++;
    }
  }
  return queryIdx === lowerQuery.length;
};

// 全局搜索
export const globalSearch = (query, categories, links) => {
  if (!query || typeof query !== 'string') {
    console.warn('搜索查询为空或非字符串类型');
    return { categories: categories || [], links: links || [] };
  }

  if (!Array.isArray(categories) || !Array.isArray(links)) {
    console.error('分类或链接列表不是数组类型');
    return { categories: [], links: [] };
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    console.warn('搜索查询为空字符串');
    return { categories: categories, links: links };
  }

  const filteredCategories = categories.filter(cat => 
    fuzzyMatch(cat.name, trimmedQuery)
  );
  
  const filteredLinks = links.filter(link => 
    fuzzyMatch(link.name, trimmedQuery) || 
    fuzzyMatch(link.description, trimmedQuery) ||
    (link.tags && link.tags.some(tag => fuzzyMatch(tag, trimmedQuery)))
  );
  
  return {
    categories: filteredCategories,
    links: filteredLinks
  };
};

// 分类内搜索
export const categorySearch = (query, links) => {
  if (!query || typeof query !== 'string') {
    console.warn('搜索查询为空或非字符串类型');
    return links || [];
  }

  if (!Array.isArray(links)) {
    console.error('链接列表不是数组类型');
    return [];
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    console.warn('搜索查询为空字符串');
    return links;
  }

  return links.filter(link => 
    fuzzyMatch(link.name, trimmedQuery) || 
    fuzzyMatch(link.description, trimmedQuery)
  );
};

// 搜索建议
export const getSuggestions = (query, links, maxSuggestions = 5) => {
  if (!query || typeof query !== 'string' || !Array.isArray(links)) {
    return [];
  }

  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) return [];

  const matches = links.filter(link => 
    link.name && link.name.toLowerCase().includes(trimmedQuery)
  );

  // 按名称匹配度排序，优先显示完全匹配的
  matches.sort((a, b) => {
    const aIncludes = a.name.toLowerCase().includes(trimmedQuery) ? 1 : 0;
    const bIncludes = b.name.toLowerCase().includes(trimmedQuery) ? 1 : 0;
    
    if (aIncludes !== bIncludes) {
      return bIncludes - aIncludes;
    }
    
    // 如果匹配度相同，按名称长度排序（较短的优先）
    return a.name.length - b.name.length;
  });

  return matches.slice(0, maxSuggestions).map(link => link.name);
};

// 高级搜索功能
export const advancedSearch = (query, categories, links, options = {}) => {
  if (!query || typeof query !== 'string') {
    console.warn('搜索查询为空或非字符串类型');
    return { categories: categories || [], links: links || [] };
  }

  if (!Array.isArray(categories) || !Array.isArray(links)) {
    console.error('分类或链接列表不是数组类型');
    return { categories: [], links: [] };
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    console.warn('搜索查询为空字符串');
    return { categories: categories, links: links };
  }

  // 解析搜索查询，支持标签搜索如 #react
  const tagMatches = trimmedQuery.match(/#(\w+)/g);
  const tags = tagMatches ? tagMatches.map(tag => tag.substring(1).toLowerCase()) : [];
  const textQuery = trimmedQuery.replace(/#\w+/g, '').trim().toLowerCase();

  // 过滤分类
  let filteredCategories = [...categories];
  if (textQuery) {
    filteredCategories = filteredCategories.filter(cat => 
      fuzzyMatch(cat.name.toLowerCase(), textQuery)
    );
  }

  // 过滤链接
  let filteredLinks = [...links];
  
  // 按文本搜索过滤
  if (textQuery) {
    filteredLinks = filteredLinks.filter(link => 
      fuzzyMatch(link.name.toLowerCase(), textQuery) || 
      fuzzyMatch(link.description.toLowerCase(), textQuery)
    );
  }
  
  // 按标签搜索过滤
  if (tags.length > 0) {
    filteredLinks = filteredLinks.filter(link => 
      link.tags && link.tags.some(tag => 
        tags.some(searchTag => 
          fuzzyMatch(tag.toLowerCase(), searchTag.toLowerCase())
        )
      )
    );
  }

  // 如果设置了按分类过滤的选项
  if (options.categoryId) {
    filteredLinks = filteredLinks.filter(link => 
      link.categoryId === options.categoryId
    );
  }

  // 如果设置了排序选项
  if (options.sortBy === 'name') {
    filteredLinks.sort((a, b) => a.name.localeCompare(b.name));
  } else if (options.sortBy === 'date') {
    // 这里可以添加日期排序逻辑
  }

  return {
    categories: filteredCategories,
    links: filteredLinks
  };
};

export default {
  globalSearch,
  categorySearch,
  getSuggestions,
  advancedSearch
};