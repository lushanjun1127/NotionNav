// pages/_app.js
// 应用入口：全局样式与图标引入
// 该文件负责注入全局 CSS（Tailwind）与第三方图标库样式，页面组件通过 Next.js 自动渲染
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';
import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect } from 'react';
import BackToTop from '../components/BackToTop';
import { initTheme } from '../core/theme-manager';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // 初始化主题
    initTheme();
    
    const onKey = (e) => {
      // 全局快捷键：/ 聚焦搜索，? 显示快捷键提示（实现可扩展）
      if (e.key === '/') {
        // 找到页面上第一个可见的输入框并聚焦
        const input = document.querySelector('input[type="search"], input[placeholder], input[type="text"]');
        if (input) {
          input.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <BackToTop />
    </ErrorBoundary>
  );
}

export default MyApp;