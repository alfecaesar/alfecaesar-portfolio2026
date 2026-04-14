import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePageAnimations<T extends HTMLElement>() {
  const rootRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const revealElements = gsap.utils.toArray<HTMLElement>('[data-animate]');
      revealElements.forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 26, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            delay: index * 0.03,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      const hoverElements = gsap.utils.toArray<HTMLElement>('[data-hover-lift]');
      hoverElements.forEach((element) => {
        const onEnter = () => {
          gsap.to(element, {
            y: -6,
            scale: 1.01,
            duration: 0.2,
            ease: 'power2.out',
          });
        };
        const onLeave = () => {
          gsap.to(element, {
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
          });
        };
        element.addEventListener('mouseenter', onEnter);
        element.addEventListener('mouseleave', onLeave);
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return rootRef;
}
