# WebNav - 基于 Notion 的网址导航系统

一个基于 Notion 数据库的现代化网址导航系统，具有完整的搜索和分类功能。

## 项目状态

当前版本为开发初期阶段，核心功能已实现，包括：
- Notion 数据库集成
- 智能搜索和过滤系统
- 响应式用户界面
- 主题切换功能
- 分类和标签系统

正在进行的开发：
- 键盘快捷键支持
- 高级搜索功能
- 用户贡献系统
- API 文档

## 功能特性

- 从 Notion 数据库获取数据
- 智能搜索和过滤
- 响应式设计
- 主题切换（亮/暗模式）
- 分类浏览和标签系统
- 键盘快捷键支持

## 技术栈

- Next.js 16 (Turbopack)
- React 19
- Tailwind CSS
- react-notion-x
- Notion API

## 安装和运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置环境变量：
   ```bash
   # .env.local
   NOTION_TOKEN=your_notion_token
   NOTION_DATABASE_ID=your_database_id
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 访问 http://localhost:3000

## 项目结构

- `components/` - React 组件
- `core/` - 核心功能模块
- `lib/` - 工具函数和配置
- `pages/` - 页面路由
- `styles/` - 样式文件

## 测试

运行测试：
```bash
npm run test
```

## 集成测试

项目包含以下模块的集成测试：
- DataProcessor: 数据解析和处理
- SearchEngine: 搜索功能
- Notion API: 与 Notion 数据库的连接
- UI Components: 用户界面组件

## Notion 配置

要使用此导航系统，您需要在 Notion 中创建一个数据库，并确保包含以下属性：
- Name: 网站名称
- URL: 网站链接
- Description: 网站描述
- Category: 分类
- Tags: 标签（多选）

## 许可证

MIT