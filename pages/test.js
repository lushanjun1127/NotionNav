// 测试页面：用于调试Notion连接
import { useEffect, useState } from 'react';

export default function TestPage() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const addToOutput = (message) => {
    setOutput(prev => prev + message + '\n');
  };

  const testConnection = async () => {
    setLoading(true);
    addToOutput('正在测试连接...');
    
    try {
      const response = await fetch('/api/test/connection', { method: 'POST' });
      const result = await response.json();
      addToOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      addToOutput(`错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const validateDatabase = async () => {
    setLoading(true);
    addToOutput('正在验证数据库...');
    
    try {
      const response = await fetch('/api/test/validate', { method: 'POST' });
      const result = await response.json();
      addToOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      addToOutput(`错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const getAllData = async () => {
    setLoading(true);
    addToOutput('正在获取所有数据...');
    
    try {
      const response = await fetch('/api/test/data', { method: 'POST' });
      const result = await response.json();
      addToOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      addToOutput(`错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-black mb-6">Notion 连接测试</h1>
        <p className="text-black mb-4">点击下方按钮测试与 Notion 的连接</p>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button 
              onClick={testConnection}
              disabled={loading}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
            >
              {loading ? '处理中...' : '测试连接'}
            </button>
            
            <button 
              onClick={validateDatabase}
              disabled={loading}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
            >
              {loading ? '处理中...' : '验证数据库'}
            </button>
            
            <button 
              onClick={getAllData}
              disabled={loading}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
            >
              {loading ? '处理中...' : '获取所有数据'}
            </button>
            
            <button 
              onClick={clearOutput}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              清空输出
            </button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded text-black whitespace-pre-wrap min-h-[300px] max-h-96 overflow-y-auto font-mono text-sm">
          {output || '输出将显示在这里...'}
        </div>
      </div>
    </div>
  );
}