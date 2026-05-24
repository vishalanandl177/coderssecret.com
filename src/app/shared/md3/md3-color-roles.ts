const CATEGORY_ACCENT_ROLES: Record<string, string> = {
  ai: 'var(--cs-category-ai)',
  frontend: 'var(--cs-category-frontend)',
  backend: 'var(--cs-category-backend)',
  devops: 'var(--cs-category-devops)',
  tutorials: 'var(--cs-category-tutorials)',
  'open-source': 'var(--cs-category-open-source)',
};

const DEFAULT_CATEGORY_ACCENT = 'var(--cs-category-default)';

export function md3CategoryAccent(slug: string): string {
  return CATEGORY_ACCENT_ROLES[slug] ?? DEFAULT_CATEGORY_ACCENT;
}

export function md3CategoryTint(slug: string, amount = 14): string {
  return `color-mix(in srgb, ${md3CategoryAccent(slug)} ${amount}%, transparent)`;
}

export function md3CategoryGradient(slug: string, startAmount = 12, endAmount = 4): string {
  const accent = md3CategoryAccent(slug);
  return `linear-gradient(135deg, color-mix(in srgb, ${accent} ${startAmount}%, transparent), color-mix(in srgb, ${accent} ${endAmount}%, transparent))`;
}

export function md3CategoryAccentLine(slug: string): string {
  return `linear-gradient(to right, transparent, ${md3CategoryAccent(slug)}, transparent)`;
}
