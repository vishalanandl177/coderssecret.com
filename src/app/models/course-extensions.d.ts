import './course.model';

declare module './course.model' {
  export interface CourseLabSafety {
    classification: 'inert' | 'synthetic' | 'benign-executable';
    requiredIsolation: string[];
    networkPolicy: 'none' | 'isolated-switch' | 'loopback-only';
    artifactHashes?: string[];
    allowedBehaviors: string[];
    prohibitedActions: string[];
    stopConditions: string[];
    teardownSteps: string[];
  }

  export interface CourseAssessmentRubricItem {
    criterion: string;
    weight: number;
    evidence: string;
  }

  export interface CourseAssessment {
    id: string;
    title: string;
    type: 'knowledge-check' | 'lab' | 'practical' | 'report' | 'capstone';
    weight?: number;
    passingScore?: number;
    safetyCritical?: boolean;
    rubric: CourseAssessmentRubricItem[];
  }

  export interface CourseFrameworkVersion {
    name: string;
    version: string;
    reviewedAt: string;
    url: string;
  }

  interface CourseLab {
    safety?: CourseLabSafety;
    assessmentCriteria?: string[];
    resources?: { label: string; url: string }[];
  }

  interface Course {
    status?: 'draft' | 'review' | 'published';
    publishedAt?: string;
    updatedAt?: string;
    safetyNotice?: string;
    frameworkVersions?: CourseFrameworkVersion[];
    assessments?: CourseAssessment[];
  }
}

export {};
