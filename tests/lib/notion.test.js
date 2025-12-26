import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllData, getCategories, getLinksByCategory, getLinkById, searchLinks, getRawDatabaseData, getDatabaseInfo } from '../../lib/notion';

// 模拟notion API相关模块
vi.mock('../../core/notion-api', async () => {
  return {
    queryDatabaseEntries: vi.fn(() => Promise.resolve([])),
    testConnection: vi.fn(() => Promise.resolve(true)),
    validateDatabaseAccess: vi.fn(() => Promise.resolve({ success: true, database: {} })),
  };
});

vi.mock('../../core/data-processor', async () => {
  return {
    default: {
      parseEntry: vi.fn((entry) => entry),
      filterValidLinks: vi.fn((links) => links),
      calculateCategoryCounts: vi.fn((links) => []),
    },
  };
});

vi.mock('../../lib/notion-mock', async () => {
  return {
    getCategories: vi.fn(() => []),
    getLinksByCategory: vi.fn(() => []),
  };
});

describe('Notion API Integration', () => {
  beforeEach(() => {
    // 清除所有模拟调用历史
    vi.clearAllMocks();
    
    // 设置环境变量
    process.env.NOTION_TOKEN = 'test-token';
    process.env.NOTION_DATABASE_ID = 'test-database-id';
  });

  describe('getAllData', () => {
    it('should return data from Notion when available', async () => {
      // 模拟返回数据
      const mockEntries = [
        { id: '1', properties: { Name: { title: [{ plain_text: 'Test' }] } } }
      ];
      
      const { queryDatabaseEntries } = await import('../../core/notion-api');
      queryDatabaseEntries.mockResolvedValue(mockEntries);
      
      const result = await getAllData();
      
      expect(queryDatabaseEntries).toHaveBeenCalledWith('test-database-id');
      expect(result).toBeDefined();
    });

    it('should return mock data when Notion is not available', async () => {
      // 模拟Notion API失败
      const { validateDatabaseAccess } = await import('../../core/notion-api');
      validateDatabaseAccess.mockResolvedValue({ success: false });
      
      // 重新导入notion-mock以确保模拟生效
      const mockModule = await import('../../lib/notion-mock');
      const getMockCategories = vi.spyOn(mockModule, 'getCategories')
        .mockResolvedValue([{ id: 'mock', name: 'Mock Category' }]);
      
      const result = await getAllData();
      
      // 验证mock函数被调用
      expect(getMockCategories).toHaveBeenCalled();
      expect(result.categories).toEqual([{ id: 'mock', name: 'Mock Category' }]);
    });
  });

  describe('getCategories', () => {
    it('should return categories', async () => {
      const mockCategories = [{ id: 'cat1', name: 'Category 1' }];
      
      // Mock getAllData to return specific data
      const getAllDataSpy = vi.spyOn(await import('../../lib/notion'), 'getAllData')
        .mockResolvedValue({ categories: mockCategories, links: [] });
      
      const result = await getCategories();
      
      expect(result).toEqual(mockCategories);
      expect(getAllDataSpy).toHaveBeenCalled();
    });
  });

  describe('getLinksByCategory', () => {
    it('should return links for a specific category', async () => {
      const mockLinks = [
        { id: '1', name: 'Link 1', categoryId: 'cat1' },
        { id: '2', name: 'Link 2', categoryId: 'cat1' },
        { id: '3', name: 'Link 3', categoryId: 'cat2' }
      ];
      
      // Mock getAllData to return specific data
      const getAllDataSpy = vi.spyOn(await import('../../lib/notion'), 'getAllData')
        .mockResolvedValue({ categories: [], links: mockLinks });
      
      const result = await getLinksByCategory('cat1');
      
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '1', name: 'Link 1', categoryId: 'cat1' },
        { id: '2', name: 'Link 2', categoryId: 'cat1' }
      ]);
      expect(getAllDataSpy).toHaveBeenCalled();
    });
  });

  describe('getLinkById', () => {
    it('should return a specific link by ID', async () => {
      const mockLinks = [
        { id: '1', name: 'Link 1', categoryId: 'cat1' },
        { id: '2', name: 'Link 2', categoryId: 'cat2' }
      ];
      
      // Mock getAllData to return specific data
      const getAllDataSpy = vi.spyOn(await import('../../lib/notion'), 'getAllData')
        .mockResolvedValue({ categories: [], links: mockLinks });
      
      const result = await getLinkById('2');
      
      expect(result).toEqual({ id: '2', name: 'Link 2', categoryId: 'cat2' });
      expect(getAllDataSpy).toHaveBeenCalled();
    });
  });

  describe('searchLinks', () => {
    it('should return links matching the search query', async () => {
      const mockLinks = [
        { id: '1', name: 'GitHub', description: 'Code repository', tags: ['dev'] },
        { id: '2', name: 'Notion', description: 'Note taking', tags: ['productivity'] }
      ];
      
      // Mock getAllData to return specific data
      const getAllDataSpy = vi.spyOn(await import('../../lib/notion'), 'getAllData')
        .mockResolvedValue({ categories: [], links: mockLinks });
      
      const result = await searchLinks('github');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('GitHub');
      expect(getAllDataSpy).toHaveBeenCalled();
    });
  });
});