import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // 发送错误到服务器日志接口
    try {
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'client-error-boundary', error: String(error), info }),
      }).catch(() => {});
    } catch (e) {}
    console.error('捕获 React 错误边界：', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="glass-card max-w-lg w-full text-center">
            <h2 className="text-xl font-semibold mb-2">抱歉，页面出现错误</h2>
            <p className="text-sm text-white/70">我们已记录错误并会尽快处理。您可以刷新页面或稍后再试。</p>
            <div className="mt-4">
              <button onClick={() => location.reload()} className="px-4 py-2 rounded bg-[var(--anime-accent-2)] text-white">刷新页面</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
