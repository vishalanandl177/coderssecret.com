import { describe, expect, it } from 'vitest';
import { SlideData, SlideLink, getSlideFocusTargets, resolveSlideFocusSteps, splitSlideNarration } from './slide-focus';

describe('splitSlideNarration', () => {
  it('keeps every sentence in its original order', () => {
    expect(splitSlideNarration('The flow is simple. A request comes in. Then the worker persists it.')).toEqual([
      'The flow is simple.',
      'A request comes in.',
      'Then the worker persists it.',
    ]);
  });

  it('returns no steps for empty narration', () => {
    expect(splitSlideNarration('   ')).toEqual([]);
  });
});

describe('resolveSlideFocusSteps', () => {
  it('keeps legacy and actionable end-slide links valid focus targets', () => {
    const links: SlideLink[] = [
      { label: 'Legacy docs', value: 'docs.example.com' },
      {
        label: 'Package',
        value: 'pypi.org/project/drf-api-logger',
        href: 'https://pypi.org/project/drf-api-logger/',
        external: true,
        analyticsResource: 'pypi',
      },
      {
        label: 'Install',
        value: 'pip install drf-api-logger',
        copyValue: 'pip install drf-api-logger',
        analyticsAction: 'install',
      },
    ];
    const slide: SlideData = {
      type: 'end',
      title: 'Keep learning',
      links,
      narration: 'Use the resources to keep learning.',
    };

    expect(getSlideFocusTargets(slide).map(target => target.key)).toEqual([
      'title',
      'link:0',
      'link:1',
      'link:2',
    ]);
  });

  it('spreads content narration from the title through the final bullet', () => {
    const slide: SlideData = {
      type: 'content',
      title: 'How it works',
      body: 'A request snapshot moves away from the request path.',
      bullets: ['Capture request', 'Queue snapshot', 'Persist log'],
      narration: 'The flow is simple. A request comes in. The snapshot enters a queue. A worker persists the log.',
    };

    const steps = resolveSlideFocusSteps(slide);

    expect(steps.map(step => step.target)).toEqual(['body', 'bullet:0', 'bullet:1', 'bullet:2']);
    expect(steps.map(step => step.narration).join(' ')).toBe(slide.narration);
  });

  it('focuses the code block for a one-sentence code explanation', () => {
    const slide: SlideData = {
      type: 'code',
      title: 'Install the package',
      code: 'pip install drf-api-logger',
      lang: 'terminal',
      narration: 'Install the package with one command.',
    };

    expect(resolveSlideFocusSteps(slide)[0]).toMatchObject({
      target: 'code',
      label: 'terminal example',
    });
  });

  it('uses authored focus steps without changing their narration', () => {
    const slide: SlideData = {
      type: 'grid',
      title: 'Request flow',
      items: [{ title: 'Queue', desc: 'Holds the snapshot' }],
      narration: 'Fallback narration.',
      focusSteps: [{
        target: 'item:0',
        narration: 'The snapshot waits in the in-memory queue.',
        label: 'In-memory queue',
        anchor: 'right',
      }],
    };

    expect(resolveSlideFocusSteps(slide)).toEqual([{
      target: 'item:0',
      narration: 'The snapshot waits in the in-memory queue.',
      label: 'In-memory queue',
      anchor: 'right',
    }]);
  });

  it('falls back safely when an authored target does not exist', () => {
    const slide: SlideData = {
      type: 'content',
      title: 'Queue behavior',
      body: 'The queue keeps request work non-blocking.',
      narration: 'Fallback narration.',
      focusSteps: [{ target: 'missing-node', narration: 'This still has a visible target.' }],
    };

    expect(resolveSlideFocusSteps(slide)[0].target).toBe('body');
  });

  it('focuses an image rather than its heading for a single diagram explanation', () => {
    const slide: SlideData = {
      type: 'image',
      title: 'Request pipeline',
      caption: 'Middleware sends snapshots to a queue.',
      src: '/assets/request-pipeline.png',
      narration: 'Follow the request snapshot through the diagram.',
    };

    expect(resolveSlideFocusSteps(slide)[0].target).toBe('image');
  });

  it('never resolves a step to a target that the slide type cannot render', () => {
    const slides: SlideData[] = [
      {
        type: 'title',
        title: 'DRF API Logger',
        subtitle: 'A practical guide.',
        tags: ['Django', 'DRF'],
        narration: 'Welcome to the guide. These are the topics we will cover.',
      },
      {
        type: 'content',
        title: 'Capture requests',
        body: 'The middleware reads the request.',
        bullets: ['Capture', 'Queue'],
        narration: 'Start with the request. Capture it. Queue it.',
      },
      {
        type: 'code',
        title: 'Install',
        code: 'pip install drf-api-logger',
        narration: 'Run this command.',
      },
      {
        type: 'grid',
        title: 'Components',
        items: [{ title: 'Middleware', desc: 'Captures data' }, { title: 'Worker', desc: 'Persists data' }],
        narration: 'The middleware captures data. The worker persists it.',
      },
      {
        type: 'image',
        title: 'Architecture',
        caption: 'The request pipeline.',
        src: '/assets/architecture.png',
        narration: 'Read the caption. Follow the diagram.',
      },
      {
        type: 'end',
        title: 'Keep learning',
        subtitle: 'Build the example yourself.',
        links: [{ label: 'Source', value: 'https://example.com' }],
        narration: 'You made it. Build the example. Open the source.',
      },
    ];

    for (const slide of slides) {
      const renderedTargets = new Set(getSlideFocusTargets(slide).map(target => target.key));
      expect(resolveSlideFocusSteps(slide).every(step => renderedTargets.has(step.target))).toBe(true);
    }
  });
});
