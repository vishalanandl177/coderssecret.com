import { describe, expect, it } from 'vitest';
import { COURSE_CATALOG, findCourseCatalogEntry, toCourseCatalogEntry } from './course-catalog';
import {
  loadCourseBySeoSlug,
  loadCourseBySlug,
  loadCourseOutlineBySlug,
  loadCourseOutlines,
  loadCourses,
} from './course-loader';
import { toCourseOutline } from './course-outline';

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

  it('loads compact landing outlines without lesson or lab implementation content', async () => {
    const [outline, fullCourse, missing] = await Promise.all([
      loadCourseOutlineBySlug('distributed-systems-engineering'),
      loadCourseBySlug('distributed-systems-engineering'),
      loadCourseOutlineBySlug('missing-course'),
    ]);

    expect(outline).toEqual(fullCourse ? toCourseOutline(fullCourse) : undefined);
    expect(missing).toBeUndefined();
    expect(outline?.modules).toHaveLength(12);
    expect(outline?.modules[0]).not.toHaveProperty('content');
    expect(outline?.modules[0]).not.toHaveProperty('svgDiagram');
    expect(outline?.modules[0].labs[0]).toEqual({
      title: fullCourse?.modules[0].labs[0].title,
    });
  });

  it('loads an SEO guide from its owning course only', async () => {
    const result = await loadCourseBySeoSlug('malware-detection-engineering');

    expect(result?.course.slug).toBe('malware-analysis-defense');
    expect(result?.page.ctaModule).toBe(12);
  });

  it('keeps catalog metadata aligned with loaded courses', async () => {
    const [courses, outlines] = await Promise.all([loadCourses(), loadCourseOutlines()]);
    expect(courses).toHaveLength(COURSE_CATALOG.length);
    expect(outlines).toHaveLength(COURSE_CATALOG.length);

    for (const course of courses) {
      expect(toCourseCatalogEntry(course)).toEqual(findCourseCatalogEntry(course.slug));
      expect(outlines.find(outline => outline.slug === course.slug)).toEqual(toCourseOutline(course));
    }
  });

  it('indexes only focused course guides with distinct editorial intent', async () => {
    const courses = await loadCourses();
    const indexableGuideSlugs = courses
      .flatMap(course => course.seoPages)
      .filter(page => page.indexable === true)
      .map(page => page.slug)
      .sort();

    expect(indexableGuideSlugs).toEqual([
      'building-malware-resistant-software',
      'machine-identity-management',
      'malware-analysis-for-developers',
      'malware-detection-engineering',
    ]);
  });
});
