// 核心框架：数据处理模块
import { notionProperties } from '../lib/notion-config';

// 分类别名映射 - 英文名称到中文别名
const categoryAliasMap = {
  'tools': '工具',
  'resources': '资源',
  'websites': '网站',
  'design': '设计',
  'development': '开发',
  'education': '教育',
  'entertainment': '娱乐',
  'social': '社交',
  'utilities': '实用工具',
  // 可以根据需要添加更多映射
};

// 查找属性
const findProperty = (entry, candidateNames) => {
  if (!entry || !entry.properties) return null;
  const lowerCandidates = candidateNames.map((n) => String(n).toLowerCase());
  for (const key of Object.keys(entry.properties)) {
    if (lowerCandidates.includes(key.toLowerCase())) {
      return entry.properties[key];
    }
  }
  return null;
};

// 生成slug - 使用英文标识符
const slugify = (name) => {
  if (!name) return 'uncategorized';
  
  // 检查是否是中文别名，如果是则返回对应的英文标识符
  const englishAlias = Object.keys(categoryAliasMap).find(
    key => categoryAliasMap[key] === name
  );
  
  if (englishAlias) {
    return englishAlias;
  }
  
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
};

// 验证URL格式
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (_) {
    return false;
  }
};

// 解析条目数据
export const parseEntry = (entry) => {
  if (!entry) {
    console.warn('条目为空，无法解析');
    return null;
  }

  try {
    const name = findProperty(entry, notionProperties.nameProperties)?.title?.[0]?.plain_text || null;
    const description = findProperty(entry, notionProperties.descriptionProperties)?.rich_text?.[0]?.plain_text || null;
    const href = findProperty(entry, notionProperties.linkProperties)?.url || entry.url || null;
    const tags = findProperty(entry, notionProperties.tagProperties)?.multi_select?.map(t => t?.name).filter(Boolean) || [];

    // 获取分类信息
    const prop = findProperty(entry, notionProperties.categoryProperties || []);
    let categoryName = null;
    if (prop) {
      // 处理关联类型字段
      if (prop.type === 'relation' && Array.isArray(prop.relation) && prop.relation.length > 0) {
        categoryName = prop.relation[0].id;
      }
      // 处理选择类型字段
      else if (prop.select && prop.select.name) {
        categoryName = prop.select.name;
      }
    }
    
    // 如果分类名在别名映射中，使用映射值
    const displayName = categoryAliasMap[categoryName] || categoryName;
    const categoryId = slugify(categoryName);

    // 验证必要字段
    if (!name) {
      console.warn(`条目缺少名称，ID: ${entry.id}`);
    }
    
    if (!href) {
      console.warn(`条目缺少链接，名称: ${name || '未知'}`);
    } else if (!isValidUrl(href)) {
      console.warn(`条目链接格式无效: ${href}`);
    }

    return {
      id: entry.id,
      name,
      description,
      href,
      tags,
      categoryName: displayName, // 显示中文别名
      categoryId, // 使用英文标识符
    };
  } catch (error) {
    console.error('解析条目失败:', error?.message || error, 'Entry ID:', entry?.id);
    return null;
  }
};

// 统计分类数量
export const calculateCategoryCounts = (links) => {
  if (!Array.isArray(links)) {
    console.warn('链接列表不是数组，无法统计分类数量');
    return [];
  }
  
  const categoryMap = new Map();
  for (const link of links) {
    if (link && link.categoryId) { // 使用categoryId而不是categoryName
      if (!categoryMap.has(link.categoryId)) {
        categoryMap.set(link.categoryId, {
          id: link.categoryId,
          name: link.categoryName, // 显示名称仍为中文
          count: 0
        });
      }
      categoryMap.get(link.categoryId).count++;
    }
  }
  
  return Array.from(categoryMap.values());
};

// 过滤有效链接
export const filterValidLinks = (links) => {
  if (!Array.isArray(links)) {
    console.warn('输入不是数组，无法过滤链接');
    return [];
  }
  
  return links.filter(link => {
    if (!link) return false;
    if (!link.name) {
      console.warn(`过滤掉缺少名称的链接: ${link.id}`);
      return false;
    }
    if (!link.href) {
      console.warn(`过滤掉缺少链接地址的链接: ${link.name}`);
      return false;
    }
    if (!isValidUrl(link.href)) {
      console.warn(`过滤掉无效链接地址的链接: ${link.href}`);
      return false;
    }
    return true;
  });
};

// 对链接按名称排序
export const sortLinksByName = (links) => {
  if (!Array.isArray(links)) {
    console.warn('输入不是数组，无法排序');
    return [];
  }
  
  return links.sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });
};

// 按分类对链接进行分组
export const groupLinksByCategory = (links) => {
  if (!Array.isArray(links)) {
    console.warn('输入不是数组，无法分组');
    return {};
  }
  
  const grouped = {};
  for (const link of links) {
    if (!link.categoryId) continue;
    
    if (!grouped[link.categoryId]) {
      grouped[link.categoryId] = [];
    }
    
    grouped[link.categoryId].push(link);
  }
  
  return grouped;
};

export default {
  parseEntry,
  calculateCategoryCounts,
  filterValidLinks,
  sortLinksByName,
  groupLinksByCategory,
};