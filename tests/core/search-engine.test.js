import { describe, it, expect } from 'vitest';
import { globalSearch, categorySearch, getSuggestions, advancedSearch } from '../../core/search-engine';

// 模拟测试数据
const mockCategories = [
  { id: 'tools', name: '工具' },
  { id: 'resources', name: '资源' },
  { id: 'websites', name: '网站' }
];

const mockLinks = [
  { id: '1', name: 'Notion', description: '强大的笔记工具', tags: ['笔记', '工具'], categoryId: 'tools', categoryName: '工具' },
  { id: '2', name: 'GitHub', description: '代码托管平台', tags: ['开发', '协作'], categoryId: 'tools', categoryName: '工具' },
  { id: '3', name: 'React', description: '前端框架', tags: ['前端', '框架'], categoryId: 'resources', categoryName: '资源' },
  { id: '4', name: 'Next.js', description: 'React框架', tags: ['前端', 'SSR'], categoryId: 'resources', categoryName: '资源' }
];

describe('SearchEngine', () => {
  describe('globalSearch', () => {
    it('should return all items when query is empty', () => {
      const result = globalSearch('', mockCategories, mockLinks);
      
      expect(result.categories).toEqual(mockCategories);
      expect(result.links).toEqual(mockLinks);
    });

    it('should filter categories and links by query', () => {
      const result = globalSearch('工具', mockCategories, mockLinks);
      
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0]).toEqual({ id: 'tools', name: '工具' });
      
      expect(result.links).toHaveLength(2);
      expect(result.links[0].name).toBe('Notion');
      expect(result.links[1].name).toBe('GitHub');
    });

    it('should handle invalid inputs', () => {
      const result = globalSearch(null, mockCategories, mockLinks);
      
      expect(result.categories).toEqual(mockCategories);
      expect(result.links).toEqual(mockLinks);
    });
  });

  describe('categorySearch', () => {
    it('should filter links within a category by query', () => {
      const result = categorySearch('notion', mockLinks);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Notion');
    });

    it('should return all links when query is empty', () => {
      const result = categorySearch('', mockLinks);
      
      expect(result).toEqual(mockLinks);
    });
  });

  describe('getSuggestions', () => {
    it('should return matching suggestions', () => {
      const result = getSuggestions('not', mockLinks, 5);
      
      expect(result).toContain('Notion');
      expect(result).not.toContain('GitHub');
    });

    it('should limit the number of suggestions', () => {
      const result = getSuggestions('a', mockLinks, 2);
      
      // We only have 2 links with 'a' in the name (React and GitHub)
      expect(result).toHaveLength(2);
    });
  });

  describe('advancedSearch', () => {
    it('should perform advanced search with options', () => {
      const result = advancedSearch('前端', mockCategories, mockLinks, { 
        categoryId: 'resources',
        sortBy: 'name'
      });
      
      // All categories since query doesn't match category names
      expect(result.categories).toHaveLength(3);
      // Should have 2 links that match "前端" tag
      expect(result.links).toHaveLength(2);
      // Both React and Next.js have '前端' tag
      expect(result.links.map(l => l.name)).toContain('React');
      expect(result.links.map(l => l.name)).toContain('Next.js');
    });

    it('should handle tag-based search', () => {
      const result = advancedSearch('#前端', mockCategories, mockLinks);
      
      expect(result.links).toHaveLength(2); // React and Next.js
      expect(result.links.some(link => link.name === 'React')).toBe(true);
      expect(result.links.some(link => link.name === 'Next.js')).toBe(true);
    });
  });
});