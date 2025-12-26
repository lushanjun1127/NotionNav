// 核心框架：Notion API交互模块
import { Client } from '@notionhq/client';

// 创建Notion客户端实例
const notion = new Client({ 
  auth: process.env.NOTION_TOKEN,
  // 添加请求超时配置
  timeout_ms: 30000, // 增加超时时间到30秒
});

// 从数据库分页获取所有条目
export const queryDatabaseEntries = async (databaseId) => {
  if (!databaseId) {
    console.warn('数据库ID为空，返回空数组');
    return [];
  }
  
  if (!process.env.NOTION_TOKEN) {
    console.error('NOTION_TOKEN 未设置');
    throw new Error('NOTION_TOKEN 环境变量未设置');
  }
  
  const allEntries = [];
  let startCursor = undefined;
  
  try {
    console.log(`开始查询数据库: ${databaseId}`);
    
    do {
      console.log(`获取数据，当前游标: ${startCursor || '开始'}`);
      
      const resp = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor,
        page_size: 100, // 使用最大页面大小以提高效率
      });
      
      console.log(`获取到 ${resp.results.length} 条记录`);
      allEntries.push(...(resp.results || []));
      startCursor = resp.has_more ? resp.next_cursor : undefined;
      
      // 添加速率限制处理
      if (startCursor) {
        console.log('等待以遵守速率限制...');
        await new Promise(resolve => setTimeout(resolve, 300)); // 等待300ms以遵守速率限制
      }
    } while (startCursor);
    
    console.log(`成功获取 ${allEntries.length} 条数据库记录`);
    return allEntries;
  } catch (error) {
    console.error('查询数据库失败:', error?.message || error);
    
    // 提供更详细的错误信息
    if (error?.code === 'NOTION_CLIENT_AUTH_ERROR') {
      console.error('认证失败：请检查您的 NOTION_TOKEN 是否正确设置');
    } else if (error?.code === 'NOTION_CLIENT_RESPONSE_ERROR') {
      console.error('响应错误：请检查数据库ID是否正确，并确认集成有访问权限');
    }
    
    throw new Error(`Notion API查询数据库失败: ${error?.message || error}`);
  }
};

// 获取单个页面
export const getPage = async (pageId) => {
  if (!pageId) {
    console.warn('页面ID为空，返回null');
    return null;
  }
  
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return page;
  } catch (error) {
    console.error('获取页面失败:', error?.message || error);
    return null;
  }
};

// 测试连接
export const testConnection = async (databaseId) => {
  try {
    if (!process.env.NOTION_TOKEN) {
      console.error('NOTION_TOKEN 未设置，无法测试连接');
      return false;
    }
    
    if (!databaseId) {
      console.error('数据库ID未提供，无法测试数据库访问');
      return false;
    }
    
    console.log('开始测试Notion连接...');
    
    // 尝试查询数据库的前几条记录来测试连接
    const testResp = await notion.databases.query({
      database_id: databaseId,
      page_size: 1, // 只获取一条记录进行测试
    });
    
    console.log('Notion API连接测试成功');
    return true;
  } catch (error) {
    console.error('Notion API连接测试失败:', error?.message || error);
    
    if (error?.code === 'NOTION_CLIENT_AUTH_ERROR') {
      console.error('认证失败：请检查您的 NOTION_TOKEN 是否正确设置');
    } else if (error?.code === 'NOTION_CLIENT_RESPONSE_ERROR') {
      console.error('响应错误：请检查数据库ID是否正确，并确认集成有访问权限');
    }
    
    return false;
  }
};

// 验证数据库权限
export const validateDatabaseAccess = async (databaseId) => {
  try {
    console.log(`验证数据库访问权限: ${databaseId}`);
    
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    console.log('数据库访问验证成功');
    console.log(`数据库标题: ${database.title[0]?.plain_text || '无标题'}`);
    console.log(`数据库属性:`, Object.keys(database.properties));
    
    return { success: true, database };
  } catch (error) {
    console.error('数据库访问验证失败:', error?.message || error);
    
    if (error?.code === 'NOTION_CLIENT_AUTH_ERROR') {
      console.error('认证失败：请检查您的 NOTION_TOKEN 是否正确设置');
    } else if (error?.code === 'NOTION_CLIENT_RESPONSE_ERROR') {
      console.error('响应错误：请检查数据库ID是否正确，并确认集成有访问权限');
    }
    
    return { success: false, error: error?.message || error };
  }
};

export default notion;