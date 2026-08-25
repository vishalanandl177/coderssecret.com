export interface CourseInstructor {
  name: string;
  title: string;
  bio: string;
  github: string;
  achievements: string[];
}

export interface CourseLab {
  title: string;
  objective: string;
  repoPath?: string;
  steps: string[];
  duration?: string;
  difficulty?: string;
  expectedOutput?: string;
}

export interface CourseModule {
  number: number;
  title: string;
  slug: string;
  subtitle: string;
  duration: string;
  objectives: string[];
  content: string;
  svgDiagram: string;
  labs: CourseLab[];
  keyTakeaways: string[];
  whyThisMatters?: string;
  realWorldUseCases?: string[];
  productionNotes?: string[];
  commonMistakes?: string[];
  thinkLikeAnEngineer?: string[];
  securityRisks?: string[];
  designTradeoffs?: { option: string; pros: string[]; cons: string[] }[];
  productionAlternatives?: { name: string; description: string }[];
  operationalStory?: string;
  careerRelevance?: string;
  beforeAfter?: { before: string[]; after: string[] };
  glossary?: { term: string; definition: string }[];
}

export interface CourseSeoPage {
  slug: string;
  /** Only focused guides with distinct, substantive search intent belong in the sitemap. */
  indexable?: boolean;
  title: string;
  description: string;
  content: string;
  ctaModule: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  description: string;
  instructor: CourseInstructor;
  totalDuration: string;
  level: string;
  tags: string[];
  category: string;
  targetAudience: string[];
  modules: CourseModule[];
  seoPages: CourseSeoPage[];
  faqs?: { question: string; answer: string }[];
  labDelivery?: 'github' | 'inline';
  outcomes?: string[];
}
