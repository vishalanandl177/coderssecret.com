import { describe, expect, it } from 'vitest';
import { COURSE_CATALOG, findCourseCatalogEntry, toCourseCatalogEntry } from './course-catalog';
import { loadCourseBySeoSlug, loadCourseBySlug, loadCourses } from './course-loader';

describe('course loader and lightweight catalog', () => {
  it('keeps the public catalog unique without importing full course content', () => {
    expect(COURSE_CATALOG).toHaveLength(7);
    expect(new Set(COURSE_CATALOG.map(course => course.slug)).size).toBe(COURSE_CATALOG.length);
    expect(COURSE_CATALOG.reduce((total, course) => total + course.moduleCount, 0)).toBe(98);
    expect(COURSE_CATALOG.reduce((total, course) => total + course.labCount, 0)).toBe(170);
  });

  it('loads existing and separately bundled courses by slug', async () => {
    const [spiffe, malware, missing] = await Promise.all([
      loadCourseBySlug('mastering-spiffe-spire'),
      loadCourseBySlug('malware-analysis-defense'),
      loadCourseBySlug('missing-course'),
    ]);

    expect(spiffe?.modules).toHaveLength(13);
    expect(malware?.modules).toHaveLength(17);
    expect(missing).toBeUndefined();
  });

  it('loads an SEO guide from its owning course only', async () => {
    const result = await loadCourseBySeoSlug('malware-detection-engineering');

    expect(result?.course.slug).toBe('malware-analysis-defense');
    expect(result?.page.ctaModule).toBe(12);
  });

  it('keeps catalog metadata aligned with loaded courses', async () => {
    const courses = await loadCourses();
    expect(courses).toHaveLength(COURSE_CATALOG.length);

    for (const course of courses) {
      expect(toCourseCatalogEntry(course)).toEqual(findCourseCatalogEntry(course.slug));
    }
  });
});
