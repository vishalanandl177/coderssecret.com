export interface Md3BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Md3Action {
  label: string;
  href: string;
  variant?: 'filled' | 'tonal' | 'outlined';
  external?: boolean;
}

export interface Md3Stat {
  value: string;
  label: string;
}

export interface Md3HeroPanel {
  title: string;
  meta: string;
  ariaLabel: string;
  stats: Md3Stat[];
  mapLabels?: string[];
}

export interface Md3Hero {
  breadcrumbs: Md3BreadcrumbItem[];
  eyebrow: string;
  title: string;
  lede: string;
  actions?: Md3Action[];
  chips?: string[];
  selectedChip?: string;
  panel?: Md3HeroPanel;
}

export interface Md3ResourceCard {
  title: string;
  description: string;
  href?: string | null;
  external?: boolean;
  icon?: string;
  badge?: string;
  selectedBadge?: boolean;
  kicker?: string;
  chips?: string[];
  actionLabel?: string;
  ariaLabel?: string;
}

export interface Md3LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface Md3LinkPanel {
  eyebrow: string;
  title: string;
  body: string;
  links: Md3LinkItem[];
}
