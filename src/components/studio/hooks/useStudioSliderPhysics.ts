import React, { useState, useRef, useEffect, useCallback } from 'react';
import { lerp } from '../../../utils';

interface UseStudioSliderPhysicsProps {
  itemCount: number;
  currentActive: number;
  setCurrentActive: (index: number | ((prev: number) => number)) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
  itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export function useStudioSliderPhysics({
  itemCount,
  currentActive,
  setCurrentActive,
  listRef,
  itemRefs,
}: UseStudioSliderPhysicsProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sliderProgress, setSliderProgress] = useState<number>(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastPointerRef = useRef({ x: 0, time: 0 });
  const velocityRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const isDragConfirmedRef = useRef(false);
  const hasJustDraggedRef = useRef(false);
  const sliderProgressRef = useRef(0);

  // Slider physics state strictly mirroring Musab's WorkSlider class
  const sliderState = useRef({
    currentMouseX: 0,
    initialMouseX: 0,
    currentPosition: 0,
    targetPosition: 0,
    initialPosition: 0,
    offsetSpeed: 1920,
    lerpSpeed: 0.1,
    speed: 0,
    active: false,
  });

  const animFrameRef = useRef<number | null>(null);

  // Expose current speed for Three.js WebGL shader distortion
  const getSpeed = useCallback(() => sliderState.current.speed, []);

  // Mouse drag: onHold
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (currentActive >= 0 || sliderState.current.active) return;
      const target = e.target as HTMLElement;
      if (
        target.closest('.button') ||
        target.closest('.close-button') ||
        target.closest('.close-button-wrapper') ||
        target.closest('a')
      ) {
        return;
      }

      if (e.button !== 0) return;
      e.preventDefault();

      dragDistanceRef.current = 0;
      isDragConfirmedRef.current = false;
      pointerStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
      lastPointerRef.current = { x: e.clientX, time: performance.now() };
      velocityRef.current = 0;

      sliderState.current.initialMouseX = e.clientX;
      sliderState.current.currentMouseX = e.clientX;
      const clientWidth = document.body.clientWidth || window.innerWidth;
      sliderState.current.offsetSpeed = clientWidth;
      sliderState.current.active = true;

      sliderState.current.initialPosition = sliderState.current.currentPosition;
      sliderState.current.targetPosition = sliderState.current.currentPosition;
      setIsDragging(true);
    },
    [currentActive]
  );

  // Mouse / Touch release: onRelease with momentum
  const handleMouseUp = useCallback(() => {
    if (!sliderState.current.active) return;

    sliderState.current.active = false;
    setIsDragging(false);

    if (isDragConfirmedRef.current) {
      hasJustDraggedRef.current = true;
      const momentum = velocityRef.current * 160;
      sliderState.current.targetPosition += momentum;
      setTimeout(() => {
        hasJustDraggedRef.current = false;
      }, 100);
    }
  }, []);

  // Mouse drag: onMouseMove
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sliderState.current.active) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    const dist = Math.hypot(dx, dy);
    dragDistanceRef.current = dist;

    if (dist >= 8) {
      isDragConfirmedRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const stepDx = e.clientX - lastPointerRef.current.x;
    const instantVelocity = stepDx / dt;
    velocityRef.current = velocityRef.current * 0.4 + instantVelocity * 0.6;
    lastPointerRef.current = { x: e.clientX, time: now };

    sliderState.current.currentMouseX = e.clientX;
    const diff =
      (sliderState.current.currentMouseX - sliderState.current.initialMouseX) * -1;
    const clientWidth = document.body.clientWidth || window.innerWidth;
    sliderState.current.targetPosition =
      Math.round(
        (sliderState.current.initialPosition -
          sliderState.current.offsetSpeed * (diff / clientWidth)) *
          100
      ) / 100;
  }, []);

  // Touch drag: onTouchStart
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (currentActive >= 0 || sliderState.current.active) return;
      const target = e.target as HTMLElement;
      if (
        target.closest('.button') ||
        target.closest('.close-button') ||
        target.closest('.close-button-wrapper') ||
        target.closest('a')
      ) {
        return;
      }

      const touch = e.touches[0];
      dragDistanceRef.current = 0;
      isDragConfirmedRef.current = false;
      pointerStartRef.current = { x: touch.clientX, y: touch.clientY, time: performance.now() };
      lastPointerRef.current = { x: touch.clientX, time: performance.now() };
      velocityRef.current = 0;

      sliderState.current.initialMouseX = touch.clientX;
      sliderState.current.currentMouseX = touch.clientX;
      const clientWidth = document.body.clientWidth || window.innerWidth;
      sliderState.current.offsetSpeed = clientWidth;
      sliderState.current.active = true;

      sliderState.current.initialPosition = sliderState.current.currentPosition;
      sliderState.current.targetPosition = sliderState.current.currentPosition;
      setIsDragging(true);
    },
    [currentActive]
  );

  // Touch drag: onTouchMove
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!sliderState.current.active) return;
    const touch = e.touches[0];
    const dx = touch.clientX - pointerStartRef.current.x;
    const dy = touch.clientY - pointerStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDy > absDx && absDy > 10 && !isDragConfirmedRef.current) {
      sliderState.current.active = false;
      setIsDragging(false);
      return;
    }

    if (absDx >= 8) {
      isDragConfirmedRef.current = true;
      if (e.cancelable) e.preventDefault();
    }

    dragDistanceRef.current = Math.hypot(dx, dy);

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const stepDx = touch.clientX - lastPointerRef.current.x;
    const instantVelocity = stepDx / dt;
    velocityRef.current = velocityRef.current * 0.4 + instantVelocity * 0.6;
    lastPointerRef.current = { x: touch.clientX, time: now };

    sliderState.current.currentMouseX = touch.clientX;
    const diff =
      (sliderState.current.currentMouseX - sliderState.current.initialMouseX) * -1;
    const clientWidth = document.body.clientWidth || window.innerWidth;
    sliderState.current.targetPosition =
      Math.round(
        (sliderState.current.initialPosition -
          sliderState.current.offsetSpeed * (diff / clientWidth)) *
          100
      ) / 100;
  }, []);

  // Trackpad horizontal swipe / Shift+Scroll
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (currentActive >= 0) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        const delta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
        if (Math.abs(delta) > 2) {
          sliderState.current.targetPosition -= delta * 1.5;
        }
      }
    },
    [currentActive]
  );

  // Toggle active project view and center item
  const toggleActiveItem = useCallback(
    (index: number) => {
      setCurrentActive((prev) => {
        const newActive = prev === index ? -1 : index;
        if (newActive >= 0 && itemRefs.current[index]) {
          const targetItem = itemRefs.current[index]!;
          const offsetLeft = targetItem.offsetLeft;
          sliderState.current.targetPosition = -(
            offsetLeft -
            window.innerWidth / 4 +
            window.innerWidth / 10
          );
        }
        return newActive;
      });
    },
    [itemRefs, setCurrentActive]
  );

  // Differentiate click from drag gesture
  const canClickItem = useCallback(() => {
    return !hasJustDraggedRef.current && dragDistanceRef.current < 8;
  }, []);

  // Window-level event listener attachments
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchcancel', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchcancel', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  // Main animation loop with lerp and boundary checks
  useEffect(() => {
    const loop = () => {
      if (listRef.current) {
        if (currentActive < 0) {
          const totalWidth = Math.max(listRef.current.scrollWidth, listRef.current.offsetWidth);
          const endPoint = Math.max(0, totalWidth - window.innerWidth);
          if (sliderState.current.targetPosition > 0) {
            sliderState.current.targetPosition = 0;
          }
          if (sliderState.current.targetPosition <= -endPoint) {
            sliderState.current.targetPosition = -endPoint;
          }
        }

        sliderState.current.currentPosition = lerp(
          sliderState.current.currentPosition,
          sliderState.current.targetPosition,
          sliderState.current.lerpSpeed
        );
        sliderState.current.speed =
          Math.round(
            (sliderState.current.currentPosition - sliderState.current.targetPosition) *
              100
          ) / 100;

        listRef.current.style.transform = `translate3d(${
          Math.round(sliderState.current.currentPosition * 100) / 100
        }px, 0px, 0px)`;

        const scrollWidth = listRef.current.scrollWidth || 2400;
        const maxScroll = Math.max(1, scrollWidth - window.innerWidth * 0.75);
        const ratio = Math.min(1, Math.max(0, -sliderState.current.currentPosition / maxScroll));
        const roundedProgress = Math.round(ratio * 100) / 100;
        const slideIdx = Math.min(
          itemCount - 1,
          Math.max(0, Math.floor(ratio * itemCount))
        );

        if (Math.abs(sliderProgressRef.current - roundedProgress) > 0.008) {
          sliderProgressRef.current = roundedProgress;
          setSliderProgress(roundedProgress);
          setCurrentSlideIndex(slideIdx);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentActive, itemCount, listRef]);

  return {
    isDragging,
    sliderProgress,
    currentSlideIndex,
    getSpeed,
    handleMouseDown,
    handleTouchStart,
    handleWheel,
    handleMouseUp,
    toggleActiveItem,
    canClickItem,
  };
}
