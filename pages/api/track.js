import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST方法' });
  }

  try {
    const { linkId, url } = req.body;

    // 验证必需参数
    if (!linkId || !url) {
      return res.status(400).json({ 
        message: '缺少必需参数: linkId 和 url' 
      });
    }

    // 验证URL格式
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ 
        message: '无效的URL格式' 
      });
    }

    // 构建日志路径
    const LOG_DIR = path.join(process.cwd(), 'logs');
    const LOG_PATH = path.join(LOG_DIR, 'clicks.log');
    
    // 确保日志目录存在
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }

    // 记录点击事件到日志文件
    const logEntry = JSON.stringify({
      linkId, 
      url, 
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    }) + '\n';

    fs.appendFileSync(LOG_PATH, logEntry);

    res.status(200).json({ 
      message: '点击记录已保存', 
      success: true 
    });
  } catch (error) {
    console.error('记录链接点击时出错:', error);
    res.status(500).json({ 
      message: '服务器内部错误', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
