import type { Course, CourseSeoPage } from './course.model';
import { findCourseCatalogEntryBySeoSlug } from './course-catalog';

const MALWARE_COURSE_SLUG = 'malware-analysis-defense';

let existingCoursesPromise: Promise<Course[]> | undefined;
let malwareCoursePromise: Promise<Course | undefined> | undefined;

function isPublished(course: Course): boolean {
  return course.status === undefined || course.status === 'published';
}

function loadExistingCourses(): Promise<Course[]> {
  existingCoursesPromise ??= import('./course.model').then(module => module.COURSES);
  return existingCoursesPromise;
}

function loadMalwareCourse(): Promise<Course | undefined> {
  malwareCoursePromise ??= import('./courses/malware-analysis-defense.course')
    .then(module => module.MALWARE_ANALYSIS_DEFENSE_COURSE)
    .then(course => isPublished(course) ? course : undefined);
  return malwareCoursePromise;
}

export async function loadCourseBySlug(slug: string): Promise<Course | undefined> {
  if (slug === MALWARE_COURSE_SLUG) {
    return loadMalwareCourse();
  }

  const courses = await loadExistingCourses();
  return courses.find(course => course.slug === slug);
}

export async function loadCourses(): Promise<Course[]> {
  const [existingCourses, malwareCourse] = await Promise.all([
    loadExistingCourses(),
    loadMalwareCourse(),
  ]);

  const courses = malwareCourse ? [...existingCourses, malwareCourse] : existingCourses;
  return [...new Map(courses.map(course => [course.slug, course])).values()];
}

export interface LoadedCourseSeoPage {
  course: Course;
  page: CourseSeoPage;
}

export async function loadCourseBySeoSlug(seoSlug: string): Promise<LoadedCourseSeoPage | undefined> {
  const catalogEntry = findCourseCatalogEntryBySeoSlug(seoSlug);
  if (!catalogEntry) return undefined;

  const course = await loadCourseBySlug(catalogEntry.slug);
  const page = course?.seoPages.find(candidate => candidate.slug === seoSlug);
  return course && page ? { course, page } : undefined;
}
