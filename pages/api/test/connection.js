// API路由：测试Notion连接
import { testConnection } from '../../../core/notion-api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST方法' });
  }

  try {
    const isConnected = await testConnection(process.env.NOTION_DATABASE_ID);
    
    res.status(200).json({ 
      success: isConnected,
      message: isConnected ? '连接测试成功' : '连接测试失败'
    });
  } catch (error) {
    console.error('连接测试错误:', error);
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}