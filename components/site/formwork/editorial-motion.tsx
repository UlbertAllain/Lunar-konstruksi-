"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Animation choreography for the editorial homepage.
 *
 * All DOM targets are scoped to the public homepage, never the admin dashboard.
 * GSAP matchMedia automatically reverts animations when the user's motion
 * preference or the viewport breakpoint changes.
 */
export function EditorialMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>(".lunar-editorial-page");
    if (!root) return;

    const media = gsap.matchMedia();

    media.add(
      {
        fullMotion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 801px)",
        touchLayout: "(max-width: 800px)",
      },
      (context) => {
        const { fullMotion, desktop } = (context.conditions ?? {}) as {
          fullMotion?: boolean;
          desktop?: boolean;
        };
        if (!fullMotion) return;

        const find = gsap.utils.selector(root);
        const section = (id: string) => root.querySelector<HTMLElement>(id);
        const distance = desktop ? 1 : 0.55;

        // The hero is a directed opening sequence, not a generic fade-in.
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(find(".e-hero-title span"), {
            yPercent: 105,
            autoAlpha: 0,
            rotation: 3,
            transformOrigin: "left bottom",
            stagger: 0.18,
            duration: 1.12,
          })
          .from(
            find(".e-hero-fact"),
            {
              y: -50,
              autoAlpha: 0,
              stagger: 0.11,
              duration: 0.75,
            },
            "-=0.68",
          )
          .fromTo(
            find(".e-hero-base-mask"),
            {
              clipPath: "inset(12% 48% 12% 48% round 16px)",
              scale: 1.08,
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 12px)",
              scale: 1,
              ease: "expo.inOut",
              duration: 1.55,
            },
            "-=0.62",
          )
          .from(
            find(".e-hero-protrusion"),
            {
              yPercent: 105,
              scale: 0.9,
              autoAlpha: 0,
              transformOrigin: "center bottom",
              ease: "expo.out",
              duration: 1.5,
            },
            "-=1.18",
          )
          .from(
            find(".e-hero-statement span"),
            {
              x: (index) => (index % 2 ? 140 : -170) * distance,
              y: 25,
              skewX: 5,
              autoAlpha: 0,
              stagger: 0.15,
              duration: 1,
            },
            "-=0.78",
          );

        const about = section("#about");
        if (about) {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: about,
              start: "top 80%",
              end: "bottom 54%",
              scrub: 1.15,
            },
          });

          timeline
            .from(find(".e-about-heading > span"), {
              yPercent: 75,
              skewY: 6,
              autoAlpha: 0,
              stagger: 0.15,
              duration: 1.1,
            })
            .from(
              find(".e-about-thumb"),
              {
                scale: 0.2,
                rotation: 25,
                clipPath: "inset(46% 46% 46% 46% round 50%)",
                duration: 1.1,
                ease: "back.out(1.7)",
                stagger: 0.18,
              },
              "<+0.2",
            )
            .from(
              find(".e-about-aside"),
              {
                x: 110 * distance,
                autoAlpha: 0,
                duration: 1,
              },
              0.25,
            )
            .fromTo(
              find(".e-about-photo"),
              {
                clipPath: "inset(4% 92% 4% 0% round 12px)",
                scale: 1.06,
              },
              {
                clipPath: "inset(0% 0% 0% 0% round 12px)",
                scale: 1,
                ease: "power2.inOut",
                duration: 1.7,
              },
              0.34,
            );
        }

        const services = section("#services");
        if (services) {
          const notes = find(".e-service-note");
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: services,
              start: "top 77%",
              end: "bottom 66%",
              scrub: desktop ? 1.3 : 0.6,
            },
          });

          timeline
            .from(
              find(".e-service-display"),
              {
                scale: 0.58,
                rotation: -10,
                autoAlpha: 0,
                ease: "back.out(1.4)",
                duration: 1.5,
              },
            )
            .from(
              notes,
              {
                x: (index) => ((index % 2 ? 1 : -1) * 175) * distance,
                y: (index) => (index % 3 === 0 ? -125 : 115) * distance,
                scale: 0.66,
                rotation: (index) => (index % 2 ? 16 : -16),
                autoAlpha: 0,
                stagger: 0.12,
                duration: 1.2,
                ease: "back.out(1.35)",
              },
              0.25,
            )
            .from(
              find(".e-service-more"),
              {
                x: 70 * distance,
                autoAlpha: 0,
                duration: 0.75,
              },
              0.9,
            );

          // Physical response to the pointer: the individual note tilts in 3D.
          // Scroll choreography and hover use separate axes.
          if (desktop) {
            const cleanups: Array<() => void> = [];

            notes.forEach((element) => {
              const node = element as HTMLElement;
              const onMove = (event: PointerEvent) => {
                const rect = node.getBoundingClientRect();
                const rx = (event.clientY - rect.top) / rect.height - 0.5;
                const ry = (event.clientX - rect.left) / rect.width - 0.5;
                gsap.to(node, {
                  rotationX: rx * -11,
                  rotationY: ry * 11,
                  transformPerspective: 900,
                  transformOrigin: "center center",
                  duration: 0.4,
                  overwrite: "auto",
                  ease: "power2.out",
                });
              };
              const onLeave = () => {
                gsap.to(node, {
                  rotationX: 0,
                  rotationY: 0,
                  duration: 0.65,
                  overwrite: "auto",
                  ease: "elastic.out(1, 0.6)",
                });
              };

              node.addEventListener("pointermove", onMove);
              node.addEventListener("pointerleave", onLeave);
              cleanups.push(() => {
                node.removeEventListener("pointermove", onMove);
                node.removeEventListener("pointerleave", onLeave);
              });
            });
            // matchMedia will call cleanup on unmount or breakpoint change.
            context.add("cleanupPointer", () => cleanups.forEach((fn) => fn()));
            return () => cleanups.forEach((fn) => fn());
          }
        }

        const projects = section("#projects");
        if (projects) {
          gsap.timeline({
            scrollTrigger: {
              trigger: projects,
              start: "top 78%",
              end: "bottom 62%",
              scrub: 1.1,
            },
          })
            .from(find(".e-project-intro"), {
              y: 95 * distance,
              rotationX: -15,
              transformPerspective: 900,
              autoAlpha: 0,
              duration: 1,
            })
            .from(find(".e-project-tile"), {
              y: (index) => (index % 2 ? 155 : -105) * distance,
              rotationY: (index) => (index % 2 ? -13 : 13) * distance,
              scale: 0.82,
              autoAlpha: 0,
              transformPerspective: 950,
              stagger: 0.13,
              duration: 1.2,
            }, 0.2);
        }

        const process = section("#process");
        if (process) {
          gsap.timeline({
            scrollTrigger: {
              trigger: process,
              start: "top 76%",
              end: "bottom 64%",
              scrub: 1.25,
            },
          })
            .from(find(".e-process-heading span"), {
              x: (index) => (index % 2 ? 120 : -110) * distance,
              skewX: -6,
              autoAlpha: 0,
              stagger: 0.2,
              duration: 1.2,
            })
            .fromTo(
              find(".e-process-photo"),
              { clipPath: "inset(40% 5% 40% 5% round 25px)", scale: 1.16 },
              {
                clipPath: "inset(0% 0% 0% 0% round 10px)",
                scale: 1,
                duration: 1.4,
                ease: "power3.inOut",
              },
              0.35,
            )
            .from(
              find(".e-process-item"),
              {
                x: 115 * distance,
                rotationX: -22,
                autoAlpha: 0,
                transformPerspective: 900,
                transformOrigin: "50% 100%",
                stagger: 0.18,
                duration: 1,
              },
              0.2,
            );
        }

        const feedback = section("#testimonials");
        if (feedback) {
          gsap.timeline({
            scrollTrigger: {
              trigger: feedback,
              start: "top 80%",
              end: "bottom 62%",
              scrub: 1,
            },
          })
            .from(find(".e-feedback-primary"), {
              clipPath: "inset(0% 100% 0% 0%)",
              x: -80 * distance,
              autoAlpha: 0,
              duration: 1.4,
            })
            .from(find(".e-feedback-secondary > div"), {
              x: (index) => (index % 2 ? 95 : -95) * distance,
              autoAlpha: 0,
              stagger: 0.18,
              duration: 1,
            }, 0.55);
        }

        const callToAction = section("#contact-cta");
        if (callToAction) {
          gsap.timeline({
            scrollTrigger: {
              trigger: callToAction,
              start: "top 86%",
              end: "bottom 72%",
              scrub: 1.2,
            },
          })
            .from(find(".e-cta-heading span"), {
              xPercent: (index) => index ? 38 : -35,
              autoAlpha: 0,
              rotation: (index) => index ? 4 : -4,
              stagger: 0.2,
              duration: 1.3,
            })
            .fromTo(
              find(".e-cta-button"),
              {
                clipPath: "polygon(48% 0%,52% 0%,52% 100%,48% 100%)",
                scale: 0.65,
                borderRadius: "38px",
              },
              {
                clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
                scale: 1,
                borderRadius: "3px",
                duration: 1.4,
                ease: "power3.inOut",
              },
              0.45,
            );
        }
      },
    );

    return () => media.revert();
  }, []);

  return null;
}
