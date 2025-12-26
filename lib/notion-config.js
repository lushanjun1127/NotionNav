// Notion数据库属性配置
const notionProperties = {
  // 分类关联字段 - 优先使用英文表头
  categoryProperties: [
    'Category',
    'Category Link', 
    'Website Categories',
    'Category ID',
    '分类',
    '分类关联',
    '分类ID',
    '导航分类',
    '分类名称',
  ],

  // 链接字段 - 优先使用英文表头
  linkProperties: [
    'URL',
    'Link',
    'Website URL',
    '链接',
    '网址',
    '网站链接',
    '地址',
    '网站地址',
  ],

  // 名称字段 - 优先使用英文表头
  nameProperties: [
    'Name',
    'Title',
    'Site Name',
    '名称',
    '标题',
    '网站名称',
    '网站标题',
    '导航名称',
  ],

  // 描述字段 - 优先使用英文表头
  descriptionProperties: [
    'Description',
    'Desc',
    '描述',
    '说明',
    '简介',
    '网站描述',
    '备注',
  ],

  // 标签字段 - 优先使用英文表头
  tagProperties: [
    'Tag',
    'Tags',
    'Website Tags',
    '标签',
    '网站标签',
    '导航标签',
    '关键词',
  ],
};

// 对外导出配置
module.exports = { notionProperties };