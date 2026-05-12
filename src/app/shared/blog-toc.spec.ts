import { describe, expect, it } from 'vitest';
import { getActiveTocHeadingId } from './blog-toc';

describe('getActiveTocHeadingId', () => {
  it('returns an empty id when no headings are available', () => {
    expect(getActiveTocHeadingId([], 140)).toBe('');
  });

  it('returns the first heading before the reader reaches the first section', () => {
    expect(getActiveTocHeadingId([
      { id: 'heading-0', top: 220 },
      { id: 'heading-1', top: 620 },
    ], 140)).toBe('heading-0');
  });

  it('returns the latest heading that has crossed the reading offset', () => {
    expect(getActiveTocHeadingId([
      { id: 'heading-0', top: -420 },
      { id: 'heading-1', top: -40 },
      { id: 'heading-2', top: 360 },
    ], 140)).toBe('heading-1');
  });

  it('keeps the final heading active near the end of the article', () => {
    expect(getActiveTocHeadingId([
      { id: 'heading-0', top: -1200 },
      { id: 'heading-1', top: -760 },
      { id: 'heading-2', top: -120 },
    ], 140)).toBe('heading-2');
  });
});
