import type { Course } from '../course.model';
import { ENVOY_CENTRALIZED_AUTH_COURSE } from './centralized-auth-envoy.course';
import { CLOUD_NATIVE_SECURITY_ENGINEERING_COURSE } from './cloud-native-security-engineering.course';
import { DISTRIBUTED_SYSTEMS_ENGINEERING_COURSE } from './distributed-systems-engineering.course';
import { MALWARE_ANALYSIS_DEFENSE_COURSE } from './malware-analysis-defense.course';
import { MASTERING_SPIFFE_SPIRE_COURSE } from './mastering-spiffe-spire.course';
import { ANALYTICS_ENGINEERING_COURSE } from './production-analytics-engineering-dbt.course';
import { PRODUCTION_RAG_SYSTEMS_ENGINEERING_COURSE } from './production-rag-systems-engineering.course';

/**
 * Build-time collection used by sitemap and exact-UI prerender generators.
 * Runtime pages must use course-loader so route bundles remain independent.
 */
export const COURSES: Course[] = [
  MASTERING_SPIFFE_SPIRE_COURSE,
  CLOUD_NATIVE_SECURITY_ENGINEERING_COURSE,
  PRODUCTION_RAG_SYSTEMS_ENGINEERING_COURSE,
  DISTRIBUTED_SYSTEMS_ENGINEERING_COURSE,
  ENVOY_CENTRALIZED_AUTH_COURSE,
  ANALYTICS_ENGINEERING_COURSE,
  MALWARE_ANALYSIS_DEFENSE_COURSE,
];
