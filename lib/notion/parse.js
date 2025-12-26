// 从 Notion 原始条目中抽取所需字段

export function findProperty(entry, candidateNames) {
  if (!entry || !entry.properties) return null;
  const lowerCandidates = candidateNames.map((n) => String(n).toLowerCase());
  for (const key of Object.keys(entry.properties)) {
    if (lowerCandidates.includes(key.toLowerCase())) {
      return entry.properties[key];
    }
  }
  return null;
}

export function slugify(name) {
  if (!name) return 'uncategorized';
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
}

export function getNameProperty(entry, notionProperties) {
  const prop = findProperty(entry, notionProperties.nameProperties);
  return prop?.title?.[0]?.plain_text || null;
}

export function getDescriptionProperty(entry, notionProperties) {
  const prop = findProperty(entry, notionProperties.descriptionProperties);
  return prop?.rich_text?.[0]?.plain_text || null;
}

export function getTagProperty(entry, notionProperties) {
  const prop = findProperty(entry, notionProperties.tagProperties);
  const items = prop?.multi_select || [];
  return items.map((i) => i?.name).filter(Boolean);
}

export function getCategorySelectValue(entry, notionProperties) {
  const prop = findProperty(entry, notionProperties.categoryProperties || []);
  if (!prop) return null;
  // 处理关联类型字段
  if (prop.type === 'relation' && Array.isArray(prop.relation) && prop.relation.length > 0) {
    return prop.relation[0].id;
  }
  // 处理选择类型字段
  if (prop.select && prop.select.name) return prop.select.name;
  return null;
}