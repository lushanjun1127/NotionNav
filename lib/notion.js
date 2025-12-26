/**
 * 项目 Notion 访问封装
 */
import { queryDatabaseEntries, testConnection, validateDatabaseAccess } from '../core/notion-api';
import DataProcessor from '../core/data-processor';
import {
  getCategories as getMockCategories,
  getLinksByCategory as getMockLinksByCategory,
} from './notion-mock';

// 缓存数据以提高性能
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 从单个数据库获取所有数据
export const getAllData = async () => {
  // 检查缓存
  const now = Date.now();
  if (cachedData && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('使用缓存数据');
    return cachedData;
  }

  try {
    if (!process.env.NOTION_TOKEN) {
      console.error('缺少 NOTION_TOKEN 环境变量');
      throw new Error('NOTION_TOKEN 环境变量未设置');
    }
    
    if (!process.env.NOTION_DATABASE_ID) {
      console.error('缺少 NOTION_DATABASE_ID 环境变量');
      throw new Error('NOTION_DATABASE_ID 环境变量未设置');
    }

    console.log('开始连接到Notion数据库...');
    
    // 首先验证数据库访问权限
    const validation = await validateDatabaseAccess(process.env.NOTION_DATABASE_ID);
    if (!validation.success) {
      console.error('数据库访问验证失败，将使用模拟数据');
      const categories = await getMockCategories();
      const links = [];
      for (const category of categories) {
        const categoryLinks = await getMockLinksByCategory(category.id);
        links.push(...categoryLinks);
      }
      const result = { categories, links };
      cachedData = result;
      cacheTimestamp = now;
      return result;
    }
    
    // 获取所有数据
    const allEntries = await queryDatabaseEntries(process.env.NOTION_DATABASE_ID);

    // 过滤有效条目并使用数据处理器解析条目
    const parsedEntries = allEntries.map(entry => DataProcessor.parseEntry(entry)).filter(Boolean);
    const validLinks = DataProcessor.filterValidLinks(parsedEntries);

    // 计算分类统计
    const categories = DataProcessor.calculateCategoryCounts(validLinks);

    const result = { categories, links: validLinks };
    cachedData = result;
    cacheTimestamp = now;

    console.log(`成功获取数据：${categories.length} 个分类，${validLinks.length} 个链接`);
    return result;
  } catch (error) {
    console.error('获取Notion数据失败:', error?.message || error);
    console.warn('API 调用失败，将回退到模拟数据以便本地测试');

    // 使用模拟数据
    const categories = await getMockCategories();
    const links = [];
    for (const category of categories) {
      const categoryLinks = await getMockLinksByCategory(category.id);
      links.push(...categoryLinks);
    }

    const result = { categories, links };
    cachedData = result;
    cacheTimestamp = now;
    return result;
  }
};

// 清除缓存
export const clearCache = () => {
  cachedData = null;
  cacheTimestamp = 0;
  console.log('数据缓存已清除');
};

// 获取所有分类
export const getCategories = async () => {
  try {
    const { categories } = await getAllData();
    return categories;
  } catch (error) {
    console.error('获取分类失败:', error?.message || error);
    return await getMockCategories();
  }
};

// 获取属于特定分类的链接
export const getLinksByCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      console.warn('分类ID为空，返回空数组');
      return [];
    }
    
    const { links } = await getAllData();
    const filteredLinks = links.filter((link) => String(link.categoryId) === String(categoryId));
    console.log(`分类 ${categoryId} 包含 ${filteredLinks.length} 个链接`);
    return filteredLinks.map((link) => ({ ...link }));
  } catch (error) {
    console.error('获取分类链接失败:', error?.message || error);
    return await getMockLinksByCategory(categoryId);
  }
};

// 根据ID获取单个链接
export const getLinkById = async (linkId) => {
  try {
    const { links } = await getAllData();
    return links.find(link => link.id === linkId);
  } catch (error) {
    console.error('获取单个链接失败:', error?.message || error);
    return null;
  }
};

// 搜索链接
export const searchLinks = async (query) => {
  try {
    const { links } = await getAllData();
    if (!query) return links;
    
    const lowerQuery = query.toLowerCase();
    return links.filter(link => 
      link.name.toLowerCase().includes(lowerQuery) || 
      (link.description && link.description.toLowerCase().includes(lowerQuery)) ||
      (link.tags && link.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  } catch (error) {
    console.error('搜索链接失败:', error?.message || error);
    return [];
  }
};

// 从Notion数据库获取原始数据（不经过处理）
export const getRawDatabaseData = async () => {
  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN 环境变量未设置');
    }
    
    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID 环境变量未设置');
    }
    
    console.log('获取原始数据库数据...');
    const allEntries = await queryDatabaseEntries(process.env.NOTION_DATABASE_ID);
    
    console.log(`获取到 ${allEntries.length} 条原始数据记录`);
    return allEntries;
  } catch (error) {
    console.error('获取原始数据库数据失败:', error?.message || error);
    return [];
  }
};

// 获取数据库结构信息
export const getDatabaseInfo = async () => {
  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN 环境变量未设置');
    }
    
    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID 环境变量未设置');
    }
    
    const { Client } = await import('@notionhq/client');
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    
    console.log('数据库信息:', {
      title: database.title[0]?.plain_text || '无标题',
      description: database.description,
      properties: Object.keys(database.properties),
      created_time: database.created_time,
      last_edited_time: database.last_edited_time
    });
    
    return {
      id: database.id,
      title: database.title[0]?.plain_text || '无标题',
      description: database.description,
      properties: database.properties,
      created_time: database.created_time,
      last_edited_time: database.last_edited_time
    };
  } catch (error) {
    console.error('获取数据库信息失败:', error?.message || error);
    return null;
  }
};

// 获取页面内容（用于渲染完整Notion页面）
export const getPageContent = async (pageId) => {
  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN 环境变量未设置');
    }
    
    if (!pageId) {
      throw new Error('页面ID未提供');
    }
    
    const { Client } = await import('@notionhq/client');
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    
    // 获取页面详细信息
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    // 获取页面的块内容
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    
    return {
      page,
      blocks: blocks.results
    };
  } catch (error) {
    console.error('获取页面内容失败:', error?.message || error);
    return null;
  }
};

// 使用notion-client获取页面内容（支持完整渲染）- 仅在服务器端使用
export const getFullPageContent = async (pageId) => {
  if (typeof window !== 'undefined') {
    // 在浏览器端不执行此操作
    console.warn('getFullPageContent should only be called server-side');
    return null;
  }

  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN 环境变量未设置');
    }
    
    if (!pageId) {
      throw new Error('页面ID未提供');
    }
    
    // 动态导入以避免在浏览器端打包
    const { NotionAPI } = await import('notion-client');
    const notionAPI = new NotionAPI({
      authToken: process.env.NOTION_TOKEN,
    });
    
    const recordMap = await notionAPI.getPage(pageId);
    
    return recordMap;
  } catch (error) {
    console.error('获取完整页面内容失败:', error?.message || error);
    return null;
  }
};