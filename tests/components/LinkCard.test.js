import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LinkCard from '../../components/LinkCard';

// 模拟fetch API
global.fetch = vi.fn();

describe('LinkCard Component', () => {
  const mockLink = {
    id: '1',
    name: 'Test Website',
    description: 'This is a test website',
    href: 'https://example.com',
    tags: ['test', 'website'],
    categoryName: '工具',
    pinned: false
  };

  beforeEach(() => {
    // 清除之前的模拟
    vi.clearAllMocks();
    
    // 模拟fetch成功响应
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ message: 'success' })
    });
  });

  it('renders link information correctly', () => {
    render(<LinkCard link={mockLink} />);
    
    expect(screen.getByText('Test Website')).toBeInTheDocument();
    expect(screen.getByText('This is a test website')).toBeInTheDocument();
    expect(screen.getByText('工具')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('website')).toBeInTheDocument();
  });

  it('opens link in new tab when clicked', () => {
    // 模拟window.open
    const openMock = vi.fn();
    Object.defineProperty(window, 'open', {
      value: openMock,
      writable: true
    });
    
    render(<LinkCard link={mockLink} />);
    
    const linkElement = screen.getByRole('link');
    fireEvent.click(linkElement);
    
    expect(openMock).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('tracks click events', async () => {
    render(<LinkCard link={mockLink} />);
    
    const linkElement = screen.getByRole('link');
    fireEvent.click(linkElement);
    
    // 确保fetch被调用
    expect(global.fetch).toHaveBeenCalledWith('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId: '1', url: 'https://example.com' }),
    });
  });

  it('handles invalid URL gracefully', () => {
    const invalidLink = {
      ...mockLink,
      href: 'invalid-url'
    };
    
    render(<LinkCard link={invalidLink} />);
    
    const linkElement = screen.getByRole('link');
    fireEvent.click(linkElement);
    
    // Should show error state
    expect(screen.getByText('无效链接')).toBeInTheDocument();
  });

  it('handles keyboard events', () => {
    const openMock = vi.fn();
    Object.defineProperty(window, 'open', {
      value: openMock,
      writable: true
    });
    
    render(<LinkCard link={mockLink} />);
    
    const linkElement = screen.getByRole('link');
    fireEvent.keyDown(linkElement, { key: 'Enter' });
    
    expect(openMock).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });
});