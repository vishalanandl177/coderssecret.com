import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SlideData, SlidePlayerComponent } from './slide-player';

const slides: SlideData[] = [
  {
    type: 'content',
    title: 'Request flow',
    body: 'The middleware captures a request snapshot.',
    bullets: ['Queue the snapshot'],
    narration: 'Start with the request. Then queue the snapshot.',
    focusSteps: [
      { target: 'body', narration: 'Start with the request.', label: 'Capture request' },
      { target: 'bullet:0', narration: 'Then queue the snapshot.', label: 'Queue snapshot' },
    ],
  },
  {
    type: 'end',
    title: 'Complete',
    narration: 'You completed the guide.',
  },
];

describe('SlidePlayerComponent teaching companion', () => {
  let fixture: ComponentFixture<SlidePlayerComponent>;
  let component: SlidePlayerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SlidePlayerComponent] }).compileComponents();
    fixture = TestBed.createComponent(SlidePlayerComponent);
    fixture.componentRef.setInput('slides', slides);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  afterEach(() => fixture.destroy());

  it('keeps the full transcript stable while focus changes', () => {
    component.activeFocusIndex.set(1);

    expect(component.currentNarrationText()).toBe('Start with the request. Then queue the snapshot.');
  });

  it('preserves the current teaching step when Guide is hidden and shown', () => {
    component.activeFocusIndex.set(1);
    component.activeFocusKey.set('bullet:0');

    component.toggleGuide();
    component.toggleGuide();

    expect(component.guideEnabled()).toBe(true);
    expect(component.activeFocusIndex()).toBe(1);
    expect(component.activeFocusKey()).toBe('bullet:0');
  });

  it('does not advance the slide when Space comes from a control', () => {
    const button = document.createElement('button');
    const event = {
      key: ' ',
      target: button,
      preventDefault: () => undefined,
    } as unknown as KeyboardEvent;

    component.onKey(event);

    expect(component.idx()).toBe(0);
  });
});
