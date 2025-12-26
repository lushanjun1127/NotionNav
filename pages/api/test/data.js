// API路由：获取所有数据
import { getAllData } from '../../../lib/notion';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST方法' });
  }

  try {
    const result = await getAllData();
    
    res.status(200).json({ 
      success: true,
      message: '数据获取成功',
      categoriesCount: result.categories.length,
      linksCount: result.links.length,
      categories: result.categories,
      links: result.links.slice(0, 10) // 只返回前10个链接以避免响应过大
    });
  } catch (error) {
    console.error('数据获取错误:', error);
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}