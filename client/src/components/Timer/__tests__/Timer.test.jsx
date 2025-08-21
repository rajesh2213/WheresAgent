import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Timer from '../Timer';

describe('Timer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders initial time as 0s', () => {
    render(<Timer gameState="idle" />);
    expect(screen.getByText('0s')).toBeInTheDocument();
  });

  it('updates time every second', async () => {
    render(<Timer gameState="playing" />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('1s')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(59000);
    });
    expect(screen.getByText('1m 0s')).toBeInTheDocument();
  });

  it('stops when gameState is not playing', async () => {
    const { rerender } = render(<Timer gameState="playing" />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('1s')).toBeInTheDocument();

    rerender(<Timer gameState="idle" />);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('0s')).toBeInTheDocument();
  });

  it('resets when gameState changes to idle', async () => {
    const { rerender } = render(<Timer gameState="playing" />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('1s')).toBeInTheDocument();

    rerender(<Timer gameState="idle" />);
    expect(screen.getByText('0s')).toBeInTheDocument();
  });
}); 