import { describe, it, expect } from 'vitest';
import DataProcessor from '../../core/data-processor';

// 模拟Notion条目数据
const mockNotionEntry = {
  id: 'test-id',
  properties: {
    Name: {
      title: [{ plain_text: '测试网站' }]
    },
    URL: {
      url: 'https://example.com'
    },
    Description: {
      rich_text: [{ plain_text: '这是一个测试网站' }]
    },
    Category: {
      select: { name: 'tools' }
    },
    Tags: {
      multi_select: [
        { name: '测试' },
        { name: '网站' }
      ]
    }
  }
};

describe('DataProcessor', () => {
  describe('parseEntry', () => {
    it('should correctly parse a Notion entry', () => {
      const result = DataProcessor.parseEntry(mockNotionEntry);
      
      expect(result).toEqual({
        id: 'test-id',
        name: '测试网站',
        description: '这是一个测试网站',
        href: 'https://example.com',
        tags: ['测试', '网站'],
        categoryName: '工具', // 根据别名映射
        categoryId: 'tools'
      });
    });

    it('should handle entries with missing fields', () => {
      const partialEntry = {
        id: 'partial-id',
        properties: {
          Name: {
            title: [{ plain_text: '部分数据网站' }]
          }
        }
      };

      const result = DataProcessor.parseEntry(partialEntry);
      
      expect(result).toEqual({
        id: 'partial-id',
        name: '部分数据网站',
        description: null,
        href: null,
        tags: [],
        categoryName: null,
        categoryId: 'uncategorized'
      });
    });

    it('should return null for invalid entries', () => {
      const result = DataProcessor.parseEntry(null);
      expect(result).toBeNull();
    });
  });

  describe('calculateCategoryCounts', () => {
    it('should correctly calculate category counts', () => {
      const links = [
        { categoryId: 'tools', categoryName: '工具' },
        { categoryId: 'tools', categoryName: '工具' },
        { categoryId: 'resources', categoryName: '资源' },
        { categoryId: 'tools', categoryName: '工具' },
      ];

      const result = DataProcessor.calculateCategoryCounts(links);
      
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        id: 'tools',
        name: '工具',
        count: 3
      });
      expect(result).toContainEqual({
        id: 'resources',
        name: '资源',
        count: 1
      });
    });

    it('should handle empty array', () => {
      const result = DataProcessor.calculateCategoryCounts([]);
      expect(result).toEqual([]);
    });
  });

  describe('filterValidLinks', () => {
    it('should filter out invalid links', () => {
      const links = [
        { id: '1', name: 'Valid Link', href: 'https://example.com' },
        { id: '2', name: '', href: 'https://example.com' },
        { id: '3', name: 'No URL Link', href: '' },
        { id: '4', name: 'Invalid URL', href: 'not-a-url' },
        { id: '5', name: 'Valid Link 2', href: 'https://example2.com' }
      ];

      const result = DataProcessor.filterValidLinks(links);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '1', name: 'Valid Link', href: 'https://example.com' },
        { id: '5', name: 'Valid Link 2', href: 'https://example2.com' }
      ]);
    });

    it('should handle empty array', () => {
      const result = DataProcessor.filterValidLinks([]);
      expect(result).toEqual([]);
    });
  });

  describe('sortLinksByName', () => {
    it('should sort links by name', () => {
      const links = [
        { name: 'Zeta' },
        { name: 'Alpha' },
        { name: 'Beta' }
      ];

      const result = DataProcessor.sortLinksByName(links);
      
      expect(result).toEqual([
        { name: 'Alpha' },
        { name: 'Beta' },
        { name: 'Zeta' }
      ]);
    });
  });

  describe('groupLinksByCategory', () => {
    it('should group links by category', () => {
      const links = [
        { name: 'Link 1', categoryId: 'tools' },
        { name: 'Link 2', categoryId: 'resources' },
        { name: 'Link 3', categoryId: 'tools' }
      ];

      const result = DataProcessor.groupLinksByCategory(links);
      
      expect(result).toEqual({
        'tools': [
          { name: 'Link 1', categoryId: 'tools' },
          { name: 'Link 3', categoryId: 'tools' }
        ],
        'resources': [
          { name: 'Link 2', categoryId: 'resources' }
        ]
      });
    });
  });
});