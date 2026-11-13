import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeHeroParallaxMetrics,
  resolveActiveSection,
} from './heroParallax';
import {
  computeMeshCenterOffsetX,
  computeNextStudioSnapTarget,
  resolveStudioKeyboardAction,
  resolveStudioTouchAxis,
  resolveStudioWheelIntent,
  shouldStudioLoopContinue,
} from '../../components/studio/studioLoopLogic';
import {
  computeNavbarBackdropState,
  shouldShowStudioActiveDot,
} from '../../components/layout/navbarLogic';
import {
  FOOTER_SIGNATURE_STROKES,
  getTotalSignatureDrawDurationMs,
} from '../../components/layout/footerSignatureLogic';
import { resolveSkillIcon } from '../../components/skills/iconResolver';

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

  it('shows Studio dot strictly when Studio is active and adapts Navbar backdrop for light Hero vs dark cosmos', () => {
    assert.equal(shouldShowStudioActiveDot('studio', 'home'), false);
    assert.equal(shouldShowStudioActiveDot('studio', 'skills'), false);
    assert.equal(shouldShowStudioActiveDot('studio', 'studio'), true);
    assert.equal(shouldShowStudioActiveDot('home', 'home'), false);

    assert.deepEqual(
      computeNavbarBackdropState({ activeSection: 'home', scrollY: 0, viewportHeight: 900 }),
      { isLightHeroBackdrop: true, isScrolled: false }
    );
    assert.deepEqual(
      computeNavbarBackdropState({ activeSection: 'home', scrollY: 420, viewportHeight: 900 }),
      { isLightHeroBackdrop: false, isScrolled: true }
    );
    assert.deepEqual(
      computeNavbarBackdropState({ activeSection: 'skills', scrollY: 1800, viewportHeight: 900 }),
      { isLightHeroBackdrop: false, isScrolled: true }
    );
  });

  it('configures 4 sequential handwritten signature strokes and memoizes resolved skill icons', () => {
    assert.equal(FOOTER_SIGNATURE_STROKES.length, 4);
    for (let i = 1; i < FOOTER_SIGNATURE_STROKES.length; i++) {
      assert.ok(
        FOOTER_SIGNATURE_STROKES[i].delayMs > FOOTER_SIGNATURE_STROKES[i - 1].delayMs,
        'Stroke delays must be strictly sequential'
      );
    }
    const totalMs = getTotalSignatureDrawDurationMs();
    assert.ok(totalMs >= 2800 && totalMs <= 3400, `Unexpected signature duration ${totalMs}ms`);

    const first = resolveSkillIcon('react', 'React');
    const second = resolveSkillIcon('react', 'React');
    assert.equal(first, second, 'resolveSkillIcon should return cached object identity');
  });

  it('prevents Studio double-scroll by isolating trackpad horizontal swipes and Shift+Wheel from vertical wheel scroll', () => {
    // Normal vertical mouse wheel -> passthrough vertical page scroll, never horizontal pan
    assert.deepEqual(
      resolveStudioWheelIntent({ deltaX: 0, deltaY: 120, shiftKey: false }),
      { mode: 'vertical-passthrough', delta: 0, shouldPreventDefault: false }
    );
    assert.deepEqual(
      resolveStudioWheelIntent({ deltaX: 8, deltaY: 90, shiftKey: false }),
      { mode: 'vertical-passthrough', delta: 0, shouldPreventDefault: false }
    );

    // Shift + vertical mouse wheel -> horizontal Studio pan + preventDefault
    assert.deepEqual(
      resolveStudioWheelIntent({ deltaX: 0, deltaY: 120, shiftKey: true }),
      { mode: 'horizontal', delta: 120, shouldPreventDefault: true }
    );

    // Trackpad horizontal swipe -> horizontal Studio pan + preventDefault
    assert.deepEqual(
      resolveStudioWheelIntent({ deltaX: -64, deltaY: 6, shiftKey: false }),
      { mode: 'horizontal', delta: -64, shouldPreventDefault: true }
    );
  });

  it('locks mobile touch axis after deadzone and resolves accessible Studio keyboard navigation', () => {
    assert.equal(resolveStudioTouchAxis(2, 3), 'none');
    assert.equal(resolveStudioTouchAxis(24, 5), 'x');
    assert.equal(resolveStudioTouchAxis(5, 24), 'y');

    assert.deepEqual(
      resolveStudioKeyboardAction({ key: 'ArrowRight', currentActive: -1, projectCount: 5 }),
      { type: 'step-track', direction: 1 }
    );
    assert.deepEqual(
      resolveStudioKeyboardAction({ key: 'ArrowLeft', currentActive: -1, projectCount: 5 }),
      { type: 'step-track', direction: -1 }
    );
    assert.deepEqual(
      resolveStudioKeyboardAction({ key: 'Escape', currentActive: 2, projectCount: 5 }),
      { type: 'close-details' }
    );
    assert.deepEqual(
      resolveStudioKeyboardAction({ key: 'ArrowRight', currentActive: 2, projectCount: 5 }),
      { type: 'select-project', nextIndex: 3 }
    );

    const offsets = [0, 380, 760, 1140];
    assert.equal(computeNextStudioSnapTarget(offsets, 0, 1, 1200), -380);
    assert.equal(computeNextStudioSnapTarget(offsets, -380, 1, 1200), -760);
    assert.equal(computeNextStudioSnapTarget(offsets, -760, -1, 1200), -380);
    assert.equal(computeNextStudioSnapTarget(offsets, -380, -1, 1200), 0);
  });
});
