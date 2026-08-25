import { describe, expect, it } from 'vitest';
import {
  BLOG_POSTS,
  compareBlogPostsByPublishedDateDesc,
  getBlogPostLastModified,
  getBlogPostSlidePath,
  sortBlogPostsByPublishedDate,
} from './blog-post.model';

describe('blog post dates and routes', () => {
  const drfPost = BLOG_POSTS.find(post => post.slug === 'drf-api-logger-django-rest-framework');

  it('keeps publication order independent from modification freshness', () => {
    const updatedOlderPost = { ...drfPost!, slug: 'updated-older-post', date: '2026-05-14', dateModified: '2026-08-26' };
    const newerPost = { ...drfPost!, slug: 'newer-post', date: '2026-07-01', dateModified: undefined };
    const posts = [updatedOlderPost, newerPost];
    const originalOrder = [...posts];

    expect([...posts].sort(compareBlogPostsByPublishedDateDesc).map(post => post.slug)).toEqual([
      'newer-post',
      'updated-older-post',
    ]);
    expect(sortBlogPostsByPublishedDate(posts).map(post => post.slug)).toEqual([
      'newer-post',
      'updated-older-post',
    ]);
    expect(posts).toEqual(originalOrder);
    expect(getBlogPostLastModified(newerPost)).toBe('2026-07-01');
    expect(getBlogPostLastModified(updatedOlderPost)).toBe('2026-08-26');
  });

  it('resolves the DRF custom slide route without changing the article slug', () => {
    expect(drfPost).toMatchObject({
      excerpt:
        'A maintainer-led guide to DRF API Logger: safely log DRF requests, mask secrets, profile slow APIs, and tune production storage.',
      date: '2026-05-14',
      dateModified: '2026-08-26',
      slideSlug: 'drf-api-logger',
      projectId: 'drf-api-logger',
    });
    expect(getBlogPostSlidePath(drfPost!)).toBe('/slides/drf-api-logger');
  });

  it('resolves the Python C Extensions custom slide route without duplicating the article slug', () => {
    const pythonCPost = BLOG_POSTS.find(post => post.slug === 'python-c-extensions-workshop');

    expect(pythonCPost).toMatchObject({
      slug: 'python-c-extensions-workshop',
      slideSlug: 'python-c-extensions',
    });
    expect(getBlogPostSlidePath(pythonCPost!)).toBe('/slides/python-c-extensions');
  });

  it('keeps catalog dates and canonical slide paths valid and unique', () => {
    const slidePaths = BLOG_POSTS.map(getBlogPostSlidePath);
    expect(new Set(slidePaths).size).toBe(slidePaths.length);

    for (const post of BLOG_POSTS) {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isFinite(Date.parse(post.date))).toBe(true);
      if (post.dateModified) {
        expect(post.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Date.parse(post.dateModified)).toBeGreaterThanOrEqual(Date.parse(post.date));
      }
    }
  });
});
