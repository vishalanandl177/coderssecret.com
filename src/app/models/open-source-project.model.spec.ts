import { describe, expect, it } from 'vitest';
import { getOpenSourceProject, OPEN_SOURCE_PROJECTS } from './open-source-project.model';

describe('open-source project metadata', () => {
  it('keeps the DRF API Logger promotion facts and destinations canonical', () => {
    const project = getOpenSourceProject('drf-api-logger');

    expect(project).toBeDefined();
    expect(project?.version).toBe('1.4.0');
    expect(project?.releaseDate).toBe('2026-07-08');
    expect(project?.compatibility).toEqual({
      python: '3.10+',
      django: '4.2+',
      djangoRestFramework: '3.16+',
    });
    expect(project?.articlePath).toBe('/blog/drf-api-logger-django-rest-framework');
    expect(project?.slidePath).toBe('/slides/drf-api-logger');
    expect(project?.officialListingStatement).toBe(
      "Listed in Django REST Framework's official third-party packages documentation. This listing is not an endorsement.",
    );
    expect(Date.parse(project?.verifiedOn || '')).toBeGreaterThanOrEqual(Date.parse(project?.releaseDate || ''));
    expect(Object.values(project?.links || {}).every(link => link.startsWith('https://'))).toBe(true);
  });

  it('uses unique project IDs and article paths', () => {
    expect(new Set(OPEN_SOURCE_PROJECTS.map(project => project.id)).size).toBe(OPEN_SOURCE_PROJECTS.length);
    expect(new Set(OPEN_SOURCE_PROJECTS.map(project => project.articlePath)).size).toBe(OPEN_SOURCE_PROJECTS.length);
  });
});
