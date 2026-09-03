export const motion = {
  duration: {
    micro: 0.22,
    hover: 0.4,
    interface: 0.65,
    reveal: 0.9,
    major: 1.1,
    cinematic: 1.4,
  },
  stagger: { text: 0.04, item: 0.07 },
  magnetic: { subtle: 0.06, normal: 0.1 },
  pointer: { media: 0.12, frame: 0.08, orbit: 0.16 },
  ease: {
    interface: "power3.out",
    cinematic: "expo.out",
    enter: "power4.out",
  },
} as const;

