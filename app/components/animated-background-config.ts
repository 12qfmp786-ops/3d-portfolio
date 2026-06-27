import type { Viewport } from "@/app/components/hooks/use-viewport";

export type Section =
  | "hero"
  | "about"
  | "techStack"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

type TransformProfile = {
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
};

type SectionStates = {
  mobile: TransformProfile;
  tablet: TransformProfile;
  desktop: TransformProfile;
};

const SKILLS_KEYBOARD_STATE: SectionStates = {
  desktop: {
    scale: { x: 0.25, y: 0.25, z: 0.25 },
    position: { x: 0, y: 0, z: 0 },
    rotation: {
      x: 0,
      y: Math.PI / 12,
      z: 0,
    },
  },
  tablet: {
    scale: { x: 0.28, y: 0.28, z: 0.28 },
    position: { x: 0, y: -60, z: 0 },
    rotation: {
      x: 0,
      y: Math.PI / 8,
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
};

export const STATES: Record<Section, SectionStates> = {
  hero: {
    desktop: {
      scale: { x: 0.32, y: 0.32, z: 0.32 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    tablet: {
      scale: { x: 0.28, y: 0.28, z: 0.28 },
      position: { x: 0, y: -100, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
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
    tablet: {
      scale: { x: 0.35, y: 0.35, z: 0.35 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 8,
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
        x: Math.PI / 12,
        y: -Math.PI / 4,
        z: 0,
      },
    },
    tablet: {
      scale: { x: 0.28, y: 0.28, z: 0.28 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: Math.PI / 8,
        y: -Math.PI / 6,
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
    tablet: {
      scale: { x: 0.28, y: 0.28, z: 0.28 },
      position: { x: 0, y: 80, z: 0 },
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
    tablet: {
      scale: { x: 0.22, y: 0.22, z: 0.22 },
      position: { x: 0, y: 80, z: 0 },
      rotation: {
        x: Math.PI,
        y: Math.PI / 3,
        z: Math.PI,
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
const TABLET_REF_WIDTH = 820;
const TABLET_REF_HEIGHT = 1180;
const DESKTOP_REF_WIDTH = 1280;
const DESKTOP_REF_HEIGHT = 900;

const getScaleOffset = (viewport: Viewport) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (viewport === "desktop") {
    const widthFactor = width / DESKTOP_REF_WIDTH;
    const heightFactor = height / DESKTOP_REF_HEIGHT;
    const targetScale = Math.min(widthFactor, heightFactor);
    return Math.min(Math.max(targetScale, 0.65), 1.0);
  }

  if (viewport === "tablet") {
    const widthFactor = width / TABLET_REF_WIDTH;
    const heightFactor = height / TABLET_REF_HEIGHT;
    const baseTarget = Math.min(Math.max(Math.min(widthFactor, heightFactor), 0.55), 0.85);
    const viewportFit = Math.min(
      (TABLET_REF_WIDTH / width) * (TABLET_REF_HEIGHT / height),
      1
    );
    return baseTarget * viewportFit;
  }

  const widthScale = width / MOBILE_REF_WIDTH;
  const baseTarget = Math.min(Math.max(widthScale, 0.5), 0.65);
  const viewportFit = Math.min(
    (MOBILE_REF_WIDTH / width) * (MOBILE_REF_HEIGHT / height),
    1
  );
  return baseTarget * viewportFit;
};

const getResponsivePosition = (
  base: TransformProfile["position"],
  viewport: Viewport
) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  let x = base.x;
  let y = base.y;

  if (viewport === "desktop" && base.x !== 0) {
    x = base.x * Math.min(width / DESKTOP_REF_WIDTH, 1);
  }

  if (viewport === "mobile") {
    if (height > MOBILE_REF_HEIGHT) {
      y -= (height - MOBILE_REF_HEIGHT) * 0.18;
    } else if (height < MOBILE_REF_HEIGHT) {
      y += (MOBILE_REF_HEIGHT - height) * 0.06;
    }
  } else if (viewport === "tablet") {
    if (height > TABLET_REF_HEIGHT) {
      y -= (height - TABLET_REF_HEIGHT) * 0.12;
    } else if (height < TABLET_REF_HEIGHT) {
      y += (TABLET_REF_HEIGHT - height) * 0.08;
    }
  } else if (height < DESKTOP_REF_HEIGHT) {
    y += (DESKTOP_REF_HEIGHT - height) * 0.05;
  }

  return { x, y, z: base.z };
};

export const getKeyboardState = ({
  section,
  viewport,
}: {
  section: Section;
  viewport: Viewport;
}) => {
  const baseTransform = STATES[section][viewport];
  const scaleOffset = getScaleOffset(viewport);
  const position = getResponsivePosition(baseTransform.position, viewport);

  return {
    ...baseTransform,
    scale: {
      x: Math.abs(baseTransform.scale.x * scaleOffset),
      y: Math.abs(baseTransform.scale.y * scaleOffset),
      z: Math.abs(baseTransform.scale.z * scaleOffset),
    },
    position,
  };
};
