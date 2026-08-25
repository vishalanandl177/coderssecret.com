import { describe, expect, it } from 'vitest';
import { getOpenSourceProject } from '../../models/open-source-project.model';
import { projectSpotlightConfigFor } from './project-spotlight.config';

describe('projectSpotlightConfigFor', () => {
  it('maps the verified DRF project registry into visible facts and canonical actions', () => {
    const project = getOpenSourceProject('drf-api-logger');
    expect(project).toBeDefined();

    const config = projectSpotlightConfigFor(project!, {
      includeArticle: true,
      includeSlides: true,
    });

    expect(config.installCommand).toBe('pip install drf-api-logger');
    expect(config.facts).toEqual(expect.arrayContaining([
      { label: 'Stable', value: 'v1.4.0' },
      { label: 'Released', value: '2026-07-08' },
      { label: 'Verified', value: '2026-08-26' },
      { label: 'License', value: 'Apache-2.0' },
    ]));
    expect(config.links.map(link => link.href)).toEqual(expect.arrayContaining([
      project!.links.pypi,
      project!.links.docs,
      project!.links.github,
      project!.links.officialDrfListing,
      project!.links.issues,
      project!.articlePath,
      project!.slidePath,
    ]));
  });
});
