import type { OpenSourceProject } from '../../models/open-source-project.model';
import type { ProjectSpotlightConfig, ProjectSpotlightLink } from './project-spotlight';

export interface ProjectSpotlightConfigOptions {
  includeArticle?: boolean;
  includeSlides?: boolean;
}

export function projectSpotlightConfigFor(
  project: OpenSourceProject,
  options: ProjectSpotlightConfigOptions = {},
): ProjectSpotlightConfig {
  const links: ProjectSpotlightLink[] = [
    { label: 'PyPI', href: project.links.pypi, resource: 'pypi', external: true },
    { label: 'Documentation', href: project.links.docs, resource: 'docs', external: true },
    { label: 'GitHub', href: project.links.github, resource: 'github', external: true },
    {
      label: 'Official DRF listing',
      href: project.links.officialDrfListing,
      resource: 'official-listing',
      external: true,
      ariaLabel: 'Django REST Framework third-party packages listing (opens in a new tab)',
    },
    { label: 'Report an issue', href: project.links.issues, resource: 'issues', external: true },
  ];

  if (options.includeArticle) {
    links.push({
      label: 'Read the full guide',
      href: project.articlePath,
      destination: 'article',
    });
  }
  if (options.includeSlides !== false) {
    links.push({
      label: 'Watch the slide walkthrough',
      href: project.slidePath,
      destination: 'slides',
    });
  }

  return {
    eyebrow: 'Maintainer-led open-source project',
    title: project.name,
    description: `${project.summary} ${project.maintainerDisclosure} ${project.officialListingStatement}`,
    installCommand: project.installCommand,
    facts: [
      { label: 'Stable', value: `v${project.version}` },
      { label: 'Released', value: project.releaseDate },
      { label: 'Verified', value: project.verifiedOn },
      {
        label: 'Compatibility',
        value: `Python ${project.compatibility.python} · Django ${project.compatibility.django} · DRF ${project.compatibility.djangoRestFramework}`,
      },
      { label: 'License', value: project.license },
    ],
    links,
  };
}
