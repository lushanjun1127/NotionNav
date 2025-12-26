import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// 在每个测试后清理DOM
afterEach(() => {
  cleanup();
});

// 模拟Next.js的router
vi.mock('next/router', async () => {
  const actual = await vi.importActual('next/router');
  return {
    ...actual,
    useRouter: vi.fn(),
  };
});

// 模拟window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});