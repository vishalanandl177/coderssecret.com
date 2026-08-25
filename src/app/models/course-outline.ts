import type { Course, CourseModule } from './course.model';

export interface CourseLabOutline {
  title: string;
}

export interface CourseModuleOutline extends Pick<
  CourseModule,
  'number' | 'title' | 'slug' | 'subtitle' | 'duration' | 'objectives'
> {
  labs: CourseLabOutline[];
}

export type CourseOutline = Omit<Course, 'modules'> & {
  modules: CourseModuleOutline[];
};

/**
 * Converts full curriculum content into the shape used by course landing and
 * focused-guide pages. The generated outline modules deliberately exclude
 * lesson HTML, SVG diagrams, lab instructions, and answer material.
 */
export function toCourseOutline(course: Course): CourseOutline {
  const { modules, ...metadata } = course;
  return {
    ...metadata,
    modules: modules.map(module => ({
      number: module.number,
      title: module.title,
      slug: module.slug,
      subtitle: module.subtitle,
      duration: module.duration,
      objectives: module.objectives,
      labs: module.labs.map(lab => ({ title: lab.title })),
    })),
  };
}
