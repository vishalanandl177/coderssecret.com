import type { Course, CourseSeoPage } from './course.model';
import type { CourseOutline } from './course-outline';
import {
  COURSE_CATALOG,
  findCourseCatalogEntryBySeoSlug,
} from './course-catalog';

type CourseLoader = () => Promise<Course>;
type CourseOutlineLoader = () => Promise<CourseOutline>;

const COURSE_LOADERS: Readonly<Record<string, CourseLoader>> = {
  'mastering-spiffe-spire': () => import('./courses/mastering-spiffe-spire.course')
    .then(module => module.MASTERING_SPIFFE_SPIRE_COURSE),
  'cloud-native-security-engineering': () => import('./courses/cloud-native-security-engineering.course')
    .then(module => module.CLOUD_NATIVE_SECURITY_ENGINEERING_COURSE),
  'production-rag-systems-engineering': () => import('./courses/production-rag-systems-engineering.course')
    .then(module => module.PRODUCTION_RAG_SYSTEMS_ENGINEERING_COURSE),
  'distributed-systems-engineering': () => import('./courses/distributed-systems-engineering.course')
    .then(module => module.DISTRIBUTED_SYSTEMS_ENGINEERING_COURSE),
  'centralized-authentication-authorization-envoy': () => import('./courses/centralized-auth-envoy.course')
    .then(module => module.ENVOY_CENTRALIZED_AUTH_COURSE),
  'production-analytics-engineering-dbt': () => import('./courses/production-analytics-engineering-dbt.course')
    .then(module => module.ANALYTICS_ENGINEERING_COURSE),
  'malware-analysis-defense': () => import('./courses/malware-analysis-defense.course')
    .then(module => module.MALWARE_ANALYSIS_DEFENSE_COURSE),
};

const COURSE_OUTLINE_LOADERS: Readonly<Record<string, CourseOutlineLoader>> = {
  'mastering-spiffe-spire': () => import('./courses/outlines/mastering-spiffe-spire.course-outline')
    .then(module => module.MASTERING_SPIFFE_SPIRE_OUTLINE),
  'cloud-native-security-engineering': () => import('./courses/outlines/cloud-native-security-engineering.course-outline')
    .then(module => module.CLOUD_NATIVE_SECURITY_ENGINEERING_OUTLINE),
  'production-rag-systems-engineering': () => import('./courses/outlines/production-rag-systems-engineering.course-outline')
    .then(module => module.PRODUCTION_RAG_SYSTEMS_ENGINEERING_OUTLINE),
  'distributed-systems-engineering': () => import('./courses/outlines/distributed-systems-engineering.course-outline')
    .then(module => module.DISTRIBUTED_SYSTEMS_ENGINEERING_OUTLINE),
  'centralized-authentication-authorization-envoy': () => import('./courses/outlines/centralized-auth-envoy.course-outline')
    .then(module => module.CENTRALIZED_AUTH_ENVOY_OUTLINE),
  'production-analytics-engineering-dbt': () => import('./courses/outlines/production-analytics-engineering-dbt.course-outline')
    .then(module => module.PRODUCTION_ANALYTICS_ENGINEERING_DBT_OUTLINE),
  'malware-analysis-defense': () => import('./courses/outlines/malware-analysis-defense.course-outline')
    .then(module => module.MALWARE_ANALYSIS_DEFENSE_OUTLINE),
};

const coursePromises = new Map<string, Promise<Course | undefined>>();
const outlinePromises = new Map<string, Promise<CourseOutline | undefined>>();

function isPublished(course: Course | CourseOutline): boolean {
  return course.status === undefined || course.status === 'published';
}

export function loadCourseBySlug(slug: string): Promise<Course | undefined> {
  const loader = COURSE_LOADERS[slug];
  if (!loader) return Promise.resolve(undefined);

  let promise = coursePromises.get(slug);
  if (!promise) {
    promise = loader().then(course => isPublished(course) ? course : undefined);
    coursePromises.set(slug, promise);
  }
  return promise;
}

export function loadCourseOutlineBySlug(slug: string): Promise<CourseOutline | undefined> {
  const loader = COURSE_OUTLINE_LOADERS[slug];
  if (!loader) return Promise.resolve(undefined);

  let promise = outlinePromises.get(slug);
  if (!promise) {
    promise = loader().then(course => isPublished(course) ? course : undefined);
    outlinePromises.set(slug, promise);
  }
  return promise;
}

export async function loadCourses(): Promise<Course[]> {
  const courses = await Promise.all(COURSE_CATALOG.map(entry => loadCourseBySlug(entry.slug)));
  return courses.filter((course): course is Course => course !== undefined);
}

export async function loadCourseOutlines(): Promise<CourseOutline[]> {
  const courses = await Promise.all(COURSE_CATALOG.map(entry => loadCourseOutlineBySlug(entry.slug)));
  return courses.filter((course): course is CourseOutline => course !== undefined);
}

export interface LoadedCourseSeoPage {
  course: CourseOutline;
  page: CourseSeoPage;
}

export async function loadCourseBySeoSlug(seoSlug: string): Promise<LoadedCourseSeoPage | undefined> {
  const catalogEntry = findCourseCatalogEntryBySeoSlug(seoSlug);
  if (!catalogEntry) return undefined;

  const course = await loadCourseOutlineBySlug(catalogEntry.slug);
  const page = course?.seoPages.find(candidate => candidate.slug === seoSlug);
  return course && page ? { course, page } : undefined;
}
