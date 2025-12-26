import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// 从单个数据库分页读取所有条目，返回原始 entries 数组
export async function queryDatabaseEntries(databaseId) {
  if (!databaseId) return [];
  const allEntries = [];
  let startCursor = undefined;
  do {
    const resp = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
    });
    allEntries.push(...(resp.results || []));
    startCursor = resp.has_more ? resp.next_cursor : undefined;
  } while (startCursor);
  return allEntries;
}

// 导出 Client 以便需要时可直接使用低层 API
export { notion };
