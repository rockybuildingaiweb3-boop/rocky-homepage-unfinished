import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeHeroParallaxMetrics,
  resolveActiveSection,
} from './heroParallax';
import {
  shouldStudioLoopContinue,
  computeMeshCenterOffsetX,
} from '../../components/studio/studioLoopLogic';

describe('P1 Performance Optimizations — Hero Parallax, ScrollSpy & Studio On-Demand Loop', () => {
  it('computes Hero day-to-night parallax metrics smoothly across scroll progression', () => {
    const atTop = computeHeroParallaxMetrics(0, 1000);
    assert.equal(atTop.bgParallaxY, 0);
    assert.equal(atTop.nebulaOffsetY, 0);
    assert.equal(atTop.textParallaxY, 0);
    assert.equal(atTop.dayToNightProgress, 0);
    assert.equal(atTop.heroOpacity, 1);
    assert.equal(atTop.heroScale, 1);
    assert.equal(atTop.sectionBackgroundColor, '#ebe8e1');

    const mid = computeHeroParallaxMetrics(425, 1000);
    assert.ok(Math.abs(mid.dayToNightProgress - 0.5) < 1e-6);
    assert.equal(mid.sectionBackgroundColor, '#06040f');
    assert.ok(mid.bgParallaxY > 0);
    assert.ok(mid.textParallaxY > 0);
    assert.ok(mid.heroOpacity < 1 && mid.heroOpacity > 0);

    const pastHero = computeHeroParallaxMetrics(2500, 1000);
    assert.equal(pastHero.dayToNightProgress, 1);
    assert.equal(pastHero.heroOpacity, 0);
    assert.equal(pastHero.heroScale, 0.94);
    assert.equal(pastHero.bottomGradientOpacity, 1);
  });

  it('resolves active navigation section from IntersectionObserver snapshots & scroll boundaries', () => {
    const sectionIds = ['home', 'studio', 'skills', 'contact'] as const;
    const baseSnapshots = [
      { id: 'home', isIntersecting: false, intersectionRatio: 0, top: -900, bottom: 0 },
      { id: 'studio', isIntersecting: true, intersectionRatio: 0.65, top: 80, bottom: 880 },
      { id: 'skills', isIntersecting: true, intersectionRatio: 0.2, top: 880, bottom: 1800 },
      { id: 'contact', isIntersecting: false, intersectionRatio: 0, top: 1800, bottom: 2300 },
    ];

    assert.equal(
      resolveActiveSection({
        sectionIds,
        snapshots: baseSnapshots,
        scrollY: 0,
        viewportHeight: 900,
        documentHeight: 3200,
      }),
      'home'
    );

    assert.equal(
      resolveActiveSection({
        sectionIds,
        snapshots: baseSnapshots,
        scrollY: 950,
        viewportHeight: 900,
        documentHeight: 3200,
      }),
      'studio'
    );

    assert.equal(
      resolveActiveSection({
        sectionIds,
        snapshots: baseSnapshots,
        scrollY: 2290,
        viewportHeight: 900,
        documentHeight: 3200,
      }),
      'contact'
    );
  });

  it('pauses Studio loop when off-screen, tab-hidden, reduced-motion, or completely settled idle', () => {
    const activeInput = {
      isInViewport: true,
      isPageVisible: true,
      isReducedMotion: false,
      isIntroPlaying: false,
      isInteracting: false,
      currentPosition: -120,
      targetPosition: -120,
      speed: 0,
      transitionUntilMs: 0,
      nowMs: 5000,
    };

    // Completely idle -> loop stops (on-demand)
    assert.equal(shouldStudioLoopContinue(activeInput), false);

    // Active drag or glide -> loop runs
    assert.equal(
      shouldStudioLoopContinue({ ...activeInput, isInteracting: true }),
      true
    );
    assert.equal(
      shouldStudioLoopContinue({ ...activeInput, currentPosition: -125, speed: -5 }),
      true
    );
    assert.equal(
      shouldStudioLoopContinue({ ...activeInput, isIntroPlaying: true }),
      true
    );
    assert.equal(
      shouldStudioLoopContinue({ ...activeInput, transitionUntilMs: 5500 }),
      true
    );

    // Off-screen or tab hidden -> always paused immediately even if motion active
    assert.equal(
      shouldStudioLoopContinue({
        ...activeInput,
        isInViewport: false,
        isInteracting: true,
        speed: 400,
      }),
      false
    );
    assert.equal(
      shouldStudioLoopContinue({
        ...activeInput,
        isPageVisible: false,
        isIntroPlaying: true,
      }),
      false
    );
    assert.equal(
      shouldStudioLoopContinue({
        ...activeInput,
        isReducedMotion: true,
        isIntroPlaying: true,
      }),
      false
    );
  });

  it('computes cached Three.js mesh center X offset identically to getBoundingClientRect math', () => {
    // Equivalent to: rect.left - window.innerWidth / 2 + rect.width / 2
    const viewportWidth = 1440;
    const width = 320;
    const baseLeft = 200;
    const trackX = -150;
    const expected = (baseLeft + trackX) - viewportWidth / 2 + width / 2;
    assert.equal(
      computeMeshCenterOffsetX(baseLeft, trackX, width, viewportWidth),
      expected
    );
  });
});
