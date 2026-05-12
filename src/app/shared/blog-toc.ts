export interface TocHeadingPosition {
  id: string;
  top: number;
}

export function getActiveTocHeadingId(headings: TocHeadingPosition[], activationOffset: number): string {
  if (headings.length === 0) return '';

  let activeId = headings[0].id;

  for (const heading of headings) {
    if (heading.top > activationOffset) break;
    activeId = heading.id;
  }

  return activeId;
}
