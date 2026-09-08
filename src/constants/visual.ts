/**
 * Visual design and lighting constants for the Rocky Babcock portfolio
 */
export const VISUAL_CONSTANTS = {
  // Particle starfield counts & styling
  PARTICLES: {
    COUNT: 1800,
    RADIUS: 1.2,
    COLOR: '#d8b4fe',
  },

  // Celestial Accretion Disk Nebula parameters
  NEBULA: {
    VIDEO_OPACITY: 0.32,
    VIDEO_BRIGHTNESS: 0.65,
    VIDEO_CONTRAST: 1.45,
    VIDEO_SATURATE: 1.40,
    MULTIPLY_ANCHOR_OPACITY: 0.12,
    FLARE_HEIGHT: '3px',
    TOP_POSITION: '45.5%',
  },

  // Multi-tier parallax scroll ratios
  PARALLAX: {
    BACKGROUND: 0.15,
    NEBULA: 0.35,
    TEXT: 0.08,
  },

  // Interactive precision cursor dimensions (px)
  CURSOR: {
    CORE_DEFAULT: 9,
    CORE_HOVER: 15,
    AURA_DEFAULT: 58,
    AURA_HOVER: 82,
    TRAIL1_SIZE: 16,
    TRAIL2_SIZE: 22,
  },
} as const;
