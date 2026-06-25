export type Section =
  | "hero"
  | "about"
  | "techStack"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

const SKILLS_KEYBOARD_STATE = {
  desktop: {
    scale: { x: 0.25, y: 0.25, z: 0.25 },
    position: { x: 400, y: -140, z: 0 },
    rotation: {
      x: 0,
      y: Math.PI / 12,
      z: 0,
    },
  },
  mobile: {
    scale: { x: 0.3, y: 0.3, z: 0.3 },
    position: { x: 0, y: -40, z: 0 },
    rotation: {
      x: 0,
      y: Math.PI / 6,
      z: 0,
    },
  },
} as const;

export const STATES = {
  hero: {
    desktop: {
      scale: { x: 0.32, y: 0.32, z: 0.32 },
      position: { x: 400, y: -20, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.30, y: 0.30, z: 0.30 },
      position: { x: 0, y: -120, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  about: {
    desktop: {
      scale: { x: 0.4, y: 0.4, z: 0.4 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 12,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.4, y: 0.4, z: 0.4 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 6,
        z: 0,
      },
    },
  },
  experience: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: Math.PI / 12, // Slight tilt forward
        y: -Math.PI / 4, // Rotate opposite to skills
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: Math.PI / 6,
        y: -Math.PI / 6,
        z: 0,
      },
    },
  },
  techStack: SKILLS_KEYBOARD_STATE,
  skills: SKILLS_KEYBOARD_STATE,
  projects: {
    desktop: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
      },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: 150, z: 0 },
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
      },
    },
  },
  contact: {
    desktop: {
      scale: { x: 0.2, y: 0.2, z: 0.2 },
      position: { x: 350, y: -250, z: 0 },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      position: { x: 0, y: 150, z: 0 },
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
      },
    },
  },
};

const MOBILE_REF_WIDTH = 390;
const MOBILE_REF_HEIGHT = 844;

export const getKeyboardState = ({
  section,
  isMobile,
}: {
  section: Section;
  isMobile: boolean;
}) => {
  const baseTransform = STATES[section][isMobile ? "mobile" : "desktop"];

  const getScaleOffset = () => {
    const width = window.innerWidth;

    if (!isMobile) {
      const DESKTOP_REF_WIDTH = 1280;
      const targetScale = width / DESKTOP_REF_WIDTH;
      const minScale = 0.65;
      const maxScale = 1.0;
      return Math.min(Math.max(targetScale, minScale), maxScale);
    }

    const height = window.innerHeight;
    const widthScale = width / MOBILE_REF_WIDTH;
    const baseTarget = Math.min(Math.max(widthScale, 0.5), 0.65);

    // Shrink on viewports larger than the reference (e.g. iPhone 14 Pro Max) so
    // the keyboard stays fully visible; smaller phones keep the existing scale.
    const viewportFit = Math.min(
      (MOBILE_REF_WIDTH / width) * (MOBILE_REF_HEIGHT / height),
      1
    );

    return baseTarget * viewportFit;
  };

  const getMobilePositionAdjust = () => {
    if (!isMobile) return { x: 0, y: 0, z: 0 };

    const height = window.innerHeight;
    const yOffset =
      height > MOBILE_REF_HEIGHT
        ? -(height - MOBILE_REF_HEIGHT) * 0.18
        : 0;

    return { x: 0, y: yOffset, z: 0 };
  };

  const scaleOffset = getScaleOffset();
  const positionAdjust = getMobilePositionAdjust();

  return {
    ...baseTransform,
    scale: {
      x: Math.abs(baseTransform.scale.x * scaleOffset),
      y: Math.abs(baseTransform.scale.y * scaleOffset),
      z: Math.abs(baseTransform.scale.z * scaleOffset),
    },
    position: {
      x: baseTransform.position.x + positionAdjust.x,
      y: baseTransform.position.y + positionAdjust.y,
      z: baseTransform.position.z + positionAdjust.z,
    },
  };
};
