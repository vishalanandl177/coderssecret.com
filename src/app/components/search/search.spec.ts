import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsService } from '../../services/analytics.service';
import { SearchComponent } from './search';

describe('SearchComponent dialog accessibility', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: AnalyticsService, useValue: { trackSearch: vi.fn() } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('closes on Escape from any focused dialog descendant', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    const topic = fixture.nativeElement.querySelector('.md3-chip') as HTMLButtonElement | null;
    expect(topic).not.toBeNull();

    topic!.focus();
    topic!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

    expect(component.isClosing()).toBe(true);
    vi.advanceTimersByTime(160);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('wraps focus at both ends of the dialog tab order', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const lastButton = buttons.item(buttons.length - 1);

    lastButton.focus();
    const forwardTab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    lastButton.dispatchEvent(forwardTab);
    expect(forwardTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(input);

    input.focus();
    const backwardTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    input.dispatchEvent(backwardTab);
    expect(backwardTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(lastButton);
  });

  it('returns focus to the element that launched the dialog', async () => {
    const launcher = document.createElement('button');
    document.body.appendChild(launcher);
    launcher.focus();

    await component.open(launcher);
    fixture.detectChanges();
    component.close();
    vi.advanceTimersByTime(160);
    await Promise.resolve();

    expect(document.activeElement).toBe(launcher);
    launcher.remove();
  });
});
