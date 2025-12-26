import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handle = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`back-to-top ${visible ? '' : 'hidden'}`}
      onClick={handle}
      aria-label="返回顶部"
      title="返回顶部"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}
