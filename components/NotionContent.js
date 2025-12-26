import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// 动态导入以减少bundle大小
const Code = dynamic(() => import('react-notion-x/build/third-party/code').then(async (m) => {
  await Promise.all([
    import('prismjs/components/prism-bash'),
    import('prismjs/components/prism-markup'),
    import('prismjs/components/prism-markup-templating'),
    import('prismjs/components/prism-c'),
    import('prismjs/components/prism-cpp'),
    import('prismjs/components/prism-csharp'),
    import('prismjs/components/prism-docker'),
    import('prismjs/components/prism-java'),
    import('prismjs/components/prism-js-templates'),
    import('prismjs/components/prism-coffeescript'),
    import('prismjs/components/prism-diff'),
    import('prismjs/components/prism-git'),
    import('prismjs/components/prism-go'),
    import('prismjs/components/prism-graphql'),
    import('prismjs/components/prism-handlebars'),
    import('prismjs/components/prism-less'),
    import('prismjs/components/prism-makefile'),
    import('prismjs/components/prism-markdown'),
    import('prismjs/components/prism-objectivec'),
    import('prismjs/components/prism-ocaml'),
    import('prismjs/components/prism-python'),
    import('prismjs/components/prism-reason'),
    import('prismjs/components/prism-ruby'),
    import('prismjs/components/prism-rust'),
    import('prismjs/components/prism-sass'),
    import('prismjs/components/prism-scss'),
    import('prismjs/components/prism-solidity'),
    import('prismjs/components/prism-sql'),
    import('prismjs/components/prism-stylus'),
    import('prismjs/components/prism-swift'),
    import('prismjs/components/prism-wasm'),
    import('prismjs/components/prism-yaml')
  ]);
  return m.Code;
}), { ssr: false });

const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then(m => m.Collection), { ssr: false });
const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then(m => m.Equation), { ssr: false });
const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf), { ssr: false });
const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then(m => m.Modal), { ssr: false });

// 自定义渲染组件
const CustomCode = ({ code, language, highlightedLines, wrap }) => {
  return (
    <Code
      code={code}
      language={language}
      highlightedLines={highlightedLines}
      wrap={wrap}
      className="custom-code-class"
    />
  );
};

// Notion内容渲染组件
const NotionContent = ({ recordMap, properties }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !recordMap) {
    return <div>加载中...</div>;
  }

  return (
    <NotionRenderer
      recordMap={recordMap}
      components={{
        Code: CustomCode,
        Collection,
        Equation,
        Pdf,
        Modal
      }}
      fullPage={false}
      darkMode={false}
    />
  );
};

export default NotionContent;