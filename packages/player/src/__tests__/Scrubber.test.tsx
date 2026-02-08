import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Scrubber } from '../components/Scrubber';

describe('Scrubber', () => {
  it('should be exported from the package', () => {
    expect(typeof Scrubber).toBe('function');
  });

  it('should render without crashing', () => {
    const { container } = render(<Scrubber value={0.5} onChange={() => {}} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should display progress based on value', () => {
    const { container } = render(<Scrubber value={0.75} onChange={() => {}} />);
    // The progress bar width should be 75%
    const progressDiv = container.querySelectorAll('div')[2]; // track is second, progress is third
    expect(progressDiv.style.width).toBe('75%');
  });

  it('should call onChange on mouse down', () => {
    const onChange = vi.fn();
    const { container } = render(<Scrubber value={0} onChange={onChange} />);
    const scrubber = container.firstChild as HTMLElement;

    // Mock getBoundingClientRect
    scrubber.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      width: 100,
      top: 0,
      height: 24,
      right: 100,
      bottom: 24,
    });

    fireEvent.mouseDown(scrubber, { clientX: 50 });
    expect(onChange).toHaveBeenCalledWith(0.5);
  });

  it('should call onScrubStart on mouse down', () => {
    const onScrubStart = vi.fn();
    const { container } = render(
      <Scrubber value={0} onChange={() => {}} onScrubStart={onScrubStart} />
    );
    const scrubber = container.firstChild as HTMLElement;
    scrubber.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0, width: 100, top: 0, height: 24, right: 100, bottom: 24,
    });

    fireEvent.mouseDown(scrubber, { clientX: 50 });
    expect(onScrubStart).toHaveBeenCalled();
  });

  it('should apply className when provided', () => {
    const { container } = render(
      <Scrubber value={0.5} onChange={() => {}} className="custom-scrubber" />
    );
    expect(container.querySelector('.custom-scrubber')).toBeTruthy();
  });

  it('should clamp values between 0 and 1', () => {
    const onChange = vi.fn();
    const { container } = render(<Scrubber value={0} onChange={onChange} />);
    const scrubber = container.firstChild as HTMLElement;
    scrubber.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0, width: 100, top: 0, height: 24, right: 100, bottom: 24,
    });

    // Click beyond the right edge
    fireEvent.mouseDown(scrubber, { clientX: 200 });
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
