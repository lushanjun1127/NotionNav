// pages/admin/categories.js
// 管理页面：展示从 Notion 读取的分类列表
// 注意：创建/更新/删除等管理操作需额外实现 API 路由并进行权限校验，本文件仅提供只读示例界面
import { getCategories } from '../../lib/notion';

export default function CategoriesAdmin({ categories }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">分类管理</h1>
      <div className="bg-white rounded-lg shadow p-4">
        {categories.map((category) => (
          <div key={category.id} className="p-2 border-b">
            <h3 className="font-semibold">
              {category.properties?.Name?.title?.[0]?.plain_text || category.name || '未命名'}
            </h3>
            <p>
              {category.properties?.Description?.rich_text?.[0]?.plain_text ||
                category.description ||
                ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  // 验证管理员权限（生产请启用）
  // const session = await getSession(context);
  // if (!session || session.user.role !== 'Admin') {
  //   return {
  //     redirect: {
  //       destination: '/api/auth/signin',
  //       permanent: false,
  //     },
  //   };
  // }

  const categories = await getCategories();
  return {
    props: {
      categories,
    },
  };
}
