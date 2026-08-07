export type SlideType = 'title' | 'content' | 'code' | 'grid' | 'image' | 'end';

export type SlideCompanionAnchor = 'auto' | 'top' | 'right' | 'bottom' | 'left';

export interface SlideFocusStep {
  target: string;
  narration: string;
  label?: string;
  anchor?: SlideCompanionAnchor;
}

export interface SlideData {
  type: SlideType;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  tags?: string[];
  code?: string;
  lang?: string;
  items?: { title: string; desc: string }[];
  src?: string;
  caption?: string;
  links?: { label: string; value: string }[];
  narration: string;
  focusSteps?: SlideFocusStep[];
}

export interface ResolvedSlideFocusStep {
  target: string;
  narration: string;
  label: string;
  anchor: SlideCompanionAnchor;
}

interface SlideFocusTarget {
  key: string;
  label: string;
}

const compactLabel = (value: string | undefined, fallback: string) => {
  const normalized = value?.replace(/\s+/g, ' ').trim();
  if (!normalized) return fallback;
  return normalized.length > 52 ? `${normalized.slice(0, 49).trimEnd()}...` : normalized;
};

export const splitSlideNarration = (narration: string): string[] => {
  const normalized = narration.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  return normalized
    .split(/(?<=[.!?])\s+(?=(?:["'(])?[A-Z0-9])/)
    .map(sentence => sentence.trim())
    .filter(Boolean);
};

export const getSlideFocusTargets = (slide: SlideData): SlideFocusTarget[] => {
  const targets: SlideFocusTarget[] = [
    { key: 'title', label: compactLabel(slide.title, 'Slide title') },
  ];

  if (slide.type === 'title') {
    if (slide.subtitle) targets.push({ key: 'subtitle', label: compactLabel(slide.subtitle, 'Introduction') });
    if (slide.tags?.length) targets.push({ key: 'tags', label: 'Key topics' });
    return targets;
  }

  if (slide.type === 'end') {
    if (slide.subtitle) targets.push({ key: 'subtitle', label: compactLabel(slide.subtitle, 'Summary') });
    slide.links?.forEach((link, index) => targets.push({ key: `link:${index}`, label: compactLabel(link.label, `Link ${index + 1}`) }));
    return targets;
  }

  if (slide.body) targets.push({ key: 'body', label: compactLabel(slide.body, 'Main idea') });

  if (slide.type === 'content') {
    slide.bullets?.forEach((bullet, index) => targets.push({ key: `bullet:${index}`, label: compactLabel(bullet, `Point ${index + 1}`) }));
  }

  if (slide.type === 'code' && slide.code) {
    targets.push({ key: 'code', label: slide.lang ? `${slide.lang} example` : 'Code example' });
  }

  if (slide.type === 'grid') {
    slide.items?.forEach((item, index) => targets.push({ key: `item:${index}`, label: compactLabel(item.title, `Item ${index + 1}`) }));
  }

  if (slide.type === 'image') {
    if (slide.caption) targets.push({ key: 'caption', label: compactLabel(slide.caption, 'Diagram caption') });
    if (slide.src) targets.push({ key: 'image', label: 'Diagram' });
  }

  return targets;
};

const getPrimaryTarget = (slide: SlideData, targets: SlideFocusTarget[]) => {
  const preferredKey = {
    title: 'title',
    content: slide.body ? 'body' : 'bullet:0',
    code: 'code',
    grid: slide.body ? 'body' : 'item:0',
    image: 'image',
    end: 'title',
  }[slide.type];

  return targets.find(target => target.key === preferredKey) ?? targets[0];
};

export const resolveSlideFocusSteps = (slide: SlideData): ResolvedSlideFocusStep[] => {
  const targets = getSlideFocusTargets(slide);
  const targetLabels = new Map(targets.map(target => [target.key, target.label]));
  const fallbackTarget = getPrimaryTarget(slide, targets);

  const authoredSteps = slide.focusSteps
    ?.map(step => {
      const requestedTarget = step.target.trim();
      const target = targetLabels.has(requestedTarget) ? requestedTarget : fallbackTarget.key;
      return {
        target,
        narration: step.narration.replace(/\s+/g, ' ').trim(),
        label: compactLabel(step.label ?? targetLabels.get(target), 'Current concept'),
        anchor: step.anchor ?? 'auto',
      };
    })
    .filter(step => step.narration);

  if (authoredSteps?.length) return authoredSteps;

  const sentences = splitSlideNarration(slide.narration);
  const narrationTargets = slide.type === 'title' || slide.type === 'end'
    ? targets
    : targets.filter(target => target.key !== 'title');
  if (!sentences.length || !narrationTargets.length) return [];

  if (sentences.length === 1) {
    const target = getPrimaryTarget(slide, narrationTargets);
    return [{
      target: target.key,
      narration: sentences[0],
      label: target.label,
      anchor: 'auto',
    }];
  }

  return sentences.map((sentence, index) => {
    const targetIndex = Math.round(index * (narrationTargets.length - 1) / (sentences.length - 1));
    const target = narrationTargets[targetIndex];
    return {
      target: target.key,
      narration: sentence,
      label: target.label,
      anchor: 'auto',
    };
  });
};
