export type OpenSourceProjectId = 'drf-api-logger';

export interface OpenSourceProjectCompatibility {
  python: string;
  django: string;
  djangoRestFramework: string;
}

export interface OpenSourceProjectLinks {
  pypi: string;
  docs: string;
  github: string;
  officialDrfListing: string;
  issues: string;
}

export interface OpenSourceProject {
  id: OpenSourceProjectId;
  name: string;
  packageName: string;
  summary: string;
  articlePath: string;
  slidePath: string;
  version: string;
  releaseDate: string;
  verifiedOn: string;
  license: string;
  installCommand: string;
  compatibility: OpenSourceProjectCompatibility;
  maintainerDisclosure: string;
  officialListingStatement: string;
  links: OpenSourceProjectLinks;
}

export const OPEN_SOURCE_PROJECTS: readonly OpenSourceProject[] = [
  {
    id: 'drf-api-logger',
    name: 'DRF API Logger',
    packageName: 'drf-api-logger',
    summary: 'Request and response observability for Django REST Framework applications.',
    articlePath: '/blog/drf-api-logger-django-rest-framework',
    slidePath: '/slides/drf-api-logger',
    version: '1.4.0',
    releaseDate: '2026-07-08',
    verifiedOn: '2026-08-26',
    license: 'Apache-2.0',
    installCommand: 'pip install drf-api-logger',
    compatibility: {
      python: '3.10+',
      django: '4.2+',
      djangoRestFramework: '3.16+',
    },
    maintainerDisclosure: 'DRF API Logger is created and maintained by Vishal Anand, the author of the CodersSecret guide.',
    officialListingStatement: "Listed in Django REST Framework's official third-party packages documentation. This listing is not an endorsement.",
    links: {
      pypi: 'https://pypi.org/project/drf-api-logger/',
      docs: 'https://drf-api-logger.readthedocs.io/en/latest/',
      github: 'https://github.com/vishalanandl177/DRF-API-Logger',
      officialDrfListing: 'https://www.django-rest-framework.org/community/third-party-packages/',
      issues: 'https://github.com/vishalanandl177/DRF-API-Logger/issues',
    },
  },
] as const;

export function getOpenSourceProject(projectId: string | undefined): OpenSourceProject | undefined {
  return OPEN_SOURCE_PROJECTS.find(project => project.id === projectId);
}

export function getOpenSourceProjectForArticle(articlePath: string): OpenSourceProject | undefined {
  return OPEN_SOURCE_PROJECTS.find(project => project.articlePath === articlePath);
}
