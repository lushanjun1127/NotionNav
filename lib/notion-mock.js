// 模拟数据 - 用于本地测试和开发
const mockCategories = [
  { id: 'tools', name: '工具', count: 3 },
  { id: 'resources', name: '资源', count: 2 },
  { id: 'websites', name: '网站', count: 1 }
];

const mockLinks = [
  {
    id: '1',
    name: 'Notion官方',
    description: '强大的笔记和协作工具',
    href: 'https://notion.so',
    tags: ['工具', '笔记'],
    categoryName: '工具',
    categoryId: 'tools'
  },
  {
    id: '2',
    name: 'GitHub',
    description: '代码托管平台',
    href: 'https://github.com',
    tags: ['开发', '协作'],
    categoryName: '工具',
    categoryId: 'tools'
  },
  {
    id: '3',
    name: 'React文档',
    description: 'React官方文档',
    href: 'https://reactjs.org',
    tags: ['前端', '文档'],
    categoryName: '资源',
    categoryId: 'resources'
  },
  {
    id: '4',
    name: 'Next.js',
    description: 'React框架',
    href: 'https://nextjs.org',
    tags: ['前端', '框架'],
    categoryName: '工具',
    categoryId: 'tools'
  },
  {
    id: '5',
    name: 'Tailwind CSS',
    description: '实用优先的CSS框架',
    href: 'https://tailwindcss.com',
    tags: ['样式', 'CSS'],
    categoryName: '资源',
    categoryId: 'resources'
  },
  {
    id: '6',
    name: 'Vercel',
    description: '前端部署平台',
    href: 'https://vercel.com',
    tags: ['部署', '云服务'],
    categoryName: '网站',
    categoryId: 'websites'
  }
];

// 获取分类的模拟函数
export const getCategories = async () => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockCategories;
};

// 根据分类获取链接的模拟函数
export const getLinksByCategory = async (categoryId) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!categoryId) {
    return [];
  }
  
  return mockLinks.filter(link => link.categoryId === categoryId);
};

// 获取所有链接的模拟函数
export const getAllLinks = async () => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockLinks;
};

// 根据ID获取单个链接的模拟函数
export const getLinkById = async (linkId) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockLinks.find(link => link.id === linkId) || null;
};

// 搜索链接的模拟函数
export const searchLinks = async (query) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!query) return mockLinks;
  
  const lowerQuery = query.toLowerCase();
  return mockLinks.filter(link => 
    link.name.toLowerCase().includes(lowerQuery) || 
    link.description.toLowerCase().includes(lowerQuery) ||
    link.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};