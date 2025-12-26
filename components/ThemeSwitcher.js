import { useEffect, useState } from 'react';
import { getSavedTheme, getSavedPreset, getSavedAuto, setSavedTheme, setSavedPreset, setSavedAuto, applyTheme, applyPreset, scheduleAutoNight } from '../utils/theme';

const PRESETS = [
  { id: 'girly', name: '少女' },
  { id: 'violet', name: '紫蓝' },
  { id: 'teal', name: '青绿' },
  { id: 'sunset', name: '夕阳' },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('dark');
  const [preset, setPreset] = useState('violet');
  const [autoNight, setAutoNight] = useState(false);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = getSavedTheme();
      const savedPreset = getSavedPreset();
      const savedAuto = getSavedAuto();
      if (savedPreset) setPreset(savedPreset);
      if (savedTheme) setTheme(savedTheme);
      if (savedAuto) setAutoNight(savedAuto);

      // apply
      applyPreset(savedPreset || 'girly');
      applyTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    } catch (e) {}
  }, []);

  useEffect(() => {
    // schedule: if enabled, set theme based on local time
    if (!autoNight) return;
    const cancel = scheduleAutoNight((newTheme) => {
      setTheme(newTheme);
      setSavedTheme(newTheme);
      applyTheme(newTheme);
    });
    return cancel;
  }, [autoNight]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      setSavedTheme(newTheme);
      applyTheme(newTheme);
      document.documentElement.classList.add('theme-transition');
      setTimeout(() => document.documentElement.classList.remove('theme-transition'), 300);
    } catch (e) {}
    // icon animation
    setAnim(true);
    setTimeout(() => setAnim(false), 420);
  };

  const changePreset = (p) => {
    setPreset(p);
    try {
      setSavedPreset(p);
      applyPreset(p);
    } catch (e) {}
  };

  const toggleAuto = () => {
    const next = !autoNight;
    setAutoNight(next);
    try { localStorage.setItem('site-theme-auto', next ? '1' : '0'); } catch (e) {}
  };

  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="切换主题"
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.03)] transition-colors relative"
      >
        <span className={`theme-icon ${anim ? 'anim' : ''}`} style={{display:'inline-block'}}>
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm7.24-2.76l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM20 11v2h3v-2h-3zM6.76 19.16l-1.79 1.79 1.79 1.79 1.79-1.79-1.79-1.79zM12 4a8 8 0 100 16 8 8 0 000-16z" fill="currentColor"/></svg>
          )}
        </span>
      </button>

      <div className="hidden md:flex items-center gap-2">
        <select
          aria-label="主题配色"
          value={preset}
          onChange={(e) => changePreset(e.target.value)}
          className="bg-[rgba(255,255,255,0.02)] text-white px-2 py-1 rounded"
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <label className="text-sm text-white/70 flex items-center gap-2">
          <input type="checkbox" checked={autoNight} onChange={toggleAuto} /> 自动夜间
        </label>
      </div>
    </div>
  );
}
