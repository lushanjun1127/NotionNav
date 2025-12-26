// API路由：验证数据库访问
import { validateDatabaseAccess } from '../../../core/notion-api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST方法' });
  }

  try {
    const result = await validateDatabaseAccess(process.env.NOTION_DATABASE_ID);
    
    res.status(200).json({ 
      success: result.success,
      message: result.success ? '数据库验证成功' : '数据库验证失败',
      database: result.success ? result.database : undefined,
      error: result.success ? undefined : result.error
    });
  } catch (error) {
    console.error('数据库验证错误:', error);
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}