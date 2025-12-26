// 核心框架：主题管理模块

// 支持的主题列表
const SUPPORTED_THEMES = ['light', 'dark', 'system'];

// 从本地存储获取主题
export const getStoredTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('theme');
  }
  return null;
};

// 存储主题到本地存储
export const storeTheme = (theme) => {
  if (SUPPORTED_THEMES.includes(theme) && typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('theme', theme);
  }
};

// 设置主题
export const setTheme = (theme) => {
  if (!SUPPORTED_THEMES.includes(theme)) {
    console.warn(`不支持的主题: ${theme}，使用默认主题: light`);
    theme = 'light';
  }

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    // 同时设置class，兼容一些CSS框架
    document.documentElement.className = theme;
    
    // 应用主题相关的样式
    applyThemeStyles(theme);
  }
  
  storeTheme(theme);
};

// 应用主题相关样式
const applyThemeStyles = (theme) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    
    // 根据少女粉主题规范设置CSS变量
    if (theme === 'dark') {
      root.style.setProperty('--primary-color', '#ec4899');
      root.style.setProperty('--primary-light', '#f472b6');
      root.style.setProperty('--primary-pale', '#fce7f3');
      root.style.setProperty('--bg-color', '#1e293b');
      root.style.setProperty('--text-color', '#f1f5f9');
      root.style.setProperty('--card-bg', '#334155');
    } else {
      root.style.setProperty('--primary-color', '#ec4899');
      root.style.setProperty('--primary-light', '#f472b6');
      root.style.setProperty('--primary-pale', '#fce7f3');
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#334155');
      root.style.setProperty('--card-bg', '#ffffff');
    }
  }
};

// 获取当前主题
export const getCurrentTheme = () => {
  if (typeof document !== 'undefined') {
    // 首先尝试从本地存储获取
    const storedTheme = getStoredTheme();
    if (storedTheme && SUPPORTED_THEMES.includes(storedTheme)) {
      return storedTheme;
    }
    
    // 然后尝试从HTML属性获取
    const attrTheme = document.documentElement.getAttribute('data-theme');
    if (attrTheme && SUPPORTED_THEMES.includes(attrTheme)) {
      return attrTheme;
    }
    
    // 最后使用系统主题或默认主题
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // 服务端渲染时使用环境变量或默认值
  return process.env.NEXT_PUBLIC_DEFAULT_THEME || 'light';
};

// 切换主题
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

// 初始化主题
export const initTheme = () => {
  const storedTheme = getStoredTheme();
  let theme;
  
  if (storedTheme && SUPPORTED_THEMES.includes(storedTheme)) {
    theme = storedTheme;
  } else {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  setTheme(theme);
};

export default {
  setTheme,
  getCurrentTheme,
  toggleTheme,
  initTheme,
  getStoredTheme,
  storeTheme
};