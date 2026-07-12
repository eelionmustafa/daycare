/**
 * Hand-drawn-style SVG icon set — replaces generic emojis site-wide with
 * artwork that matches the Logo's crayon-sun aesthetic. Stroke follows
 * `currentColor` so icons tint via text color classes; small warm accent
 * fills use the site palette.
 */

type IconProps = { className?: string };

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const SUN = "#edb94e";
const TERRA = "#d96c4f";

export function IconSun({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4.5" fill={SUN} />
      <g stroke={TERRA} strokeWidth="1.9" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="4.5" />
        <line x1="12" y1="19.5" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4.5" y2="12" />
        <line x1="19.5" y1="12" x2="22" y2="12" />
        <line x1="4.8" y1="4.8" x2="6.6" y2="6.6" />
        <line x1="17.4" y1="17.4" x2="19.2" y2="19.2" />
        <line x1="4.8" y1="19.2" x2="6.6" y2="17.4" />
        <line x1="17.4" y1="6.6" x2="19.2" y2="4.8" />
      </g>
    </svg>
  );
}

export function IconHeart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 20 C 5 15, 2.5 10.5, 5 7 C 7 4.4, 10.5 5, 12 8 C 13.5 5, 17 4.4, 19 7 C 21.5 10.5, 19 15, 12 20 Z"
        {...S}
        fill="#f9c9d8"
      />
    </svg>
  );
}

export function IconBook({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 6 C 9.5 4.2, 5.8 4, 3.5 5 V 18.5 C 5.8 17.5, 9.5 17.7, 12 19.5" {...S} fill="#fff" />
      <path d="M12 6 C 14.5 4.2, 18.2 4, 20.5 5 V 18.5 C 18.2 17.5, 14.5 17.7, 12 19.5" {...S} fill="#fff" />
      <line x1="12" y1="6" x2="12" y2="19.5" {...S} />
    </svg>
  );
}

export function IconPalette({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3 C 6.5 3, 3 7, 3 11.5 C 3 16.5, 7 20, 11 20 C 12.7 20, 13 19, 12.5 17.8 C 12 16.5, 12.8 15.4, 14.2 15.4 L 17 15.4 C 19.4 15.4, 21 13.6, 21 11 C 21 6.5, 17 3, 12 3 Z"
        {...S}
        fill="#fff"
      />
      <circle cx="8" cy="9" r="1.4" fill={TERRA} />
      <circle cx="12.5" cy="7" r="1.4" fill={SUN} />
      <circle cx="16.5" cy="9.8" r="1.4" fill="#7c9885" />
      <circle cx="7.5" cy="13.5" r="1.4" fill="#6d8ca8" />
    </svg>
  );
}

export function IconBall({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" {...S} fill="#fff" />
      <path d="M12 3.5 C 15 7, 15 17, 12 20.5 M3.5 12 h17" {...S} />
      <path d="M5.5 6 C 8.5 8.5, 15.5 8.5, 18.5 6 M5.5 18 C 8.5 15.5, 15.5 15.5, 18.5 18" {...S} />
    </svg>
  );
}

export function IconSunrise({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M5 16 a 7 7 0 0 1 14 0" {...S} fill={SUN} />
      <line x1="2" y1="16" x2="22" y2="16" {...S} />
      <line x1="4" y1="19.5" x2="20" y2="19.5" {...S} strokeDasharray="2.5 3" />
      <g stroke={TERRA} strokeWidth="1.9" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="5.2" />
        <line x1="5" y1="6.5" x2="6.6" y2="8.1" />
        <line x1="19" y1="6.5" x2="17.4" y2="8.1" />
      </g>
    </svg>
  );
}

export function IconBackpack({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M7 8 C 7 4.5, 9 3, 12 3 C 15 3, 17 4.5, 17 8" {...S} />
      <rect x="5" y="8" width="14" height="13" rx="4" {...S} fill="#fff" />
      <path d="M8.5 12.5 h7 v4 h-7 Z" {...S} fill="#f3e2d6" />
      <line x1="12" y1="12.5" x2="12" y2="14" {...S} />
    </svg>
  );
}

export function IconHome({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4 11 L12 4 L20 11 V 20 H 4 Z" {...S} fill="#fff" />
      <path d="M9.5 20 v-5.5 h5 V 20" {...S} fill="#f3e2d6" />
    </svg>
  );
}

export function IconWave({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M7 12 V 6.5 a1.5 1.5 0 0 1 3 0 V 11 M10 10.5 V 5 a1.5 1.5 0 0 1 3 0 V 10.5 M13 10.5 V 6 a1.5 1.5 0 0 1 3 0 V 12"
        {...S}
        fill="#fff"
      />
      <path
        d="M7 12 C 5.8 10.8, 4.2 11.4, 4.6 13 C 5.4 16.2, 7 20.5, 11.5 20.5 C 15 20.5, 16 18.5, 16 15.5 V 12"
        {...S}
        fill="#fff"
      />
      <path d="M18.5 5.5 C 20 6.5, 20.6 7.6, 20.8 9" {...S} stroke={SUN} />
    </svg>
  );
}

export function IconScissors({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="6" cy="6.5" r="2.5" {...S} />
      <circle cx="6" cy="17.5" r="2.5" {...S} />
      <path d="M8.2 7.8 L 20 17 M8.2 16.2 L 20 7" {...S} />
    </svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 21 C 7.5 16, 5 12.5, 5 9.5 A 7 7 0 0 1 19 9.5 C 19 12.5, 16.5 16, 12 21 Z" {...S} fill="#fff" />
      <circle cx="12" cy="9.5" r="2.5" fill={TERRA} />
    </svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M5 4 h4 l1.5 4 -2.2 1.8 a 12 12 0 0 0 6 6 L 16 13.5 l4 1.5 v4 c0 1-1 1.6-2 1.5 C 10 19.7 4.3 14 3.5 6 C 3.4 5, 4 4, 5 4 Z"
        {...S}
        fill="#fff"
      />
    </svg>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" {...S} fill="#fff" />
      <path d="M4 7 L12 13.5 L20 7" {...S} />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" {...S} fill="#fff" />
      <path d="M12 7.5 V 12 L 15.5 14" {...S} />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="8" r="4" {...S} fill="#fff" />
      <path d="M4.5 20 C 5.5 16, 8.5 14.5, 12 14.5 C 15.5 14.5, 18.5 16, 19.5 20" {...S} />
    </svg>
  );
}

export function IconChild({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="8.5" r="4.5" {...S} fill="#fff" />
      <path d="M6.5 20.5 C 7.3 17.2, 9.4 15.8, 12 15.8 C 14.6 15.8, 16.7 17.2, 17.5 20.5" {...S} />
      <path d="M10 7.8 q .4 .6 1 .6 M13 7.8 q .4 .6 1 .6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M10.6 10.6 q 1.4 1 2.8 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 3 L 19.5 5.8 V 11 C 19.5 15.8, 16.5 19.4, 12 21 C 7.5 19.4, 4.5 15.8, 4.5 11 V 5.8 Z" {...S} fill="#fff" />
      <path d="M9 11.5 l2.2 2.3 L 15.5 9.3" {...S} stroke="#7c9885" />
    </svg>
  );
}

export function IconHands({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M9.5 17 C 5 13.8, 3.3 10.9, 5 8.6 C 6.3 6.8, 8.7 7.2, 9.7 9.2"
        {...S}
        fill="#f9c9d8"
      />
      <path
        d="M9.7 9.2 C 10.7 7.2, 13.1 6.8, 14.4 8.6 C 16.1 10.9, 14.4 13.8, 9.9 17"
        {...S}
        fill="#f9c9d8"
      />
      <path
        d="M15.2 18.5 C 12 16.2, 10.8 14.1, 12 12.4 C 13 11.1, 14.7 11.4, 15.4 12.8 C 16.1 11.4, 17.8 11.1, 18.8 12.4 C 20 14.1, 18.8 16.2, 15.6 18.5"
        {...S}
        fill="#fff"
      />
    </svg>
  );
}

export function IconSparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 3 L 13.8 10.2 L 21 12 L 13.8 13.8 L 12 21 L 10.2 13.8 L 3 12 L 10.2 10.2 Z" {...S} fill={SUN} />
      <path d="M18.5 3.5 v3 M17 5 h3" stroke={TERRA} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" {...S} fill="#fff" />
      <circle cx="12" cy="12" r="5" {...S} />
      <circle cx="12" cy="12" r="1.8" fill={TERRA} />
    </svg>
  );
}

export function IconConfetti({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M7 13 L 4 20.5 L 11.5 17.5 Z" {...S} fill={SUN} />
      <path d="M11 9 q 2 -3 5 -2.5 M13.5 12 q 3 -1 5 1" {...S} />
      <circle cx="17" cy="5.5" r="1.1" fill={TERRA} />
      <circle cx="20" cy="9.5" r="1.1" fill="#7c9885" />
      <circle cx="13" cy="4.5" r="1.1" fill="#6d8ca8" />
    </svg>
  );
}

export function IconNote({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" {...S} fill="#fff" />
      <path d="M8.5 8.5 h7 M8.5 12 h7 M8.5 15.5 h4" {...S} />
    </svg>
  );
}

export function IconAlert({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 4 L 21 19 H 3 Z" {...S} fill="#fff6e8" />
      <line x1="12" y1="9.5" x2="12" y2="14" {...S} stroke={TERRA} />
      <circle cx="12" cy="16.5" r="1" fill={TERRA} />
    </svg>
  );
}

export function IconBalloonSm({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <ellipse cx="12" cy="8.5" rx="5.5" ry="6.5" {...S} fill="#f9c9d8" />
      <path d="M12 15 l-1 1.8 h2 Z" fill="currentColor" />
      <path d="M12 17 q -1.5 2.5 0 5" {...S} />
    </svg>
  );
}

export function IconKiteSm({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2.5 L 19 9.5 L 12 16.5 L 5 9.5 Z" {...S} fill="#ffd3b3" />
      <path d="M12 16.5 q -2 3 0 5" {...S} />
      <path d="M12 2.5 V 16.5 M5 9.5 h14" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

export function IconStarSm({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3 L 14.6 8.8 L 21 9.6 L 16.3 14 L 17.5 20.3 L 12 17.2 L 6.5 20.3 L 7.7 14 L 3 9.6 L 9.4 8.8 Z"
        {...S}
        fill={SUN}
      />
    </svg>
  );
}

export function IconPennant({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <line x1="6" y1="3" x2="6" y2="21" {...S} />
      <path d="M6 4.5 L 19 7.5 L 6 11 Z" {...S} fill="#a8d8f0" />
    </svg>
  );
}

export function IconTeddySm({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="7" cy="6" r="2.6" {...S} fill="#f3e0c8" />
      <circle cx="17" cy="6" r="2.6" {...S} fill="#f3e0c8" />
      <circle cx="12" cy="11" r="6" {...S} fill="#fff" />
      <circle cx="10" cy="10" r="0.9" fill="currentColor" />
      <circle cx="14" cy="10" r="0.9" fill="currentColor" />
      <ellipse cx="12" cy="13" rx="2.2" ry="1.6" {...S} fill="#f3e0c8" />
      <path d="M8 17.5 C 8.8 20, 15.2 20, 16 17.5" {...S} />
    </svg>
  );
}

export function IconGradCapSm({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 4.5 L 22 9 L 12 13.5 L 2 9 Z" {...S} fill="#fff" />
      <path d="M6.5 11 v4.5 q 5.5 3.5 11 0 V 11" {...S} />
      <path d="M22 9 v5" {...S} stroke={SUN} />
      <circle cx="22" cy="15" r="1.1" fill={SUN} />
    </svg>
  );
}

export function IconSprout({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 21 V 11" {...S} stroke="#7c9885" />
      <path d="M12 11 C 12 6.5, 15 4.5, 19.5 4.5 C 19.5 9, 16.5 11, 12 11 Z" {...S} stroke="#7c9885" fill="#b9e6c9" />
      <path d="M12 14 C 12 10.8, 9.8 9.3, 6.5 9.3 C 6.5 12.6, 8.7 14, 12 14 Z" {...S} stroke="#7c9885" fill="#e4f3e8" />
    </svg>
  );
}

export function IconPrinter({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M7 8 V 3.5 h10 V 8" {...S} />
      <rect x="4" y="8" width="16" height="8" rx="2" {...S} fill="#fff" />
      <rect x="7" y="13" width="10" height="7.5" rx="1" {...S} fill="#fff" />
      <circle cx="17" cy="10.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function IconCamera({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M8 7 L 9.5 4.5 h5 L 16 7 h3 a2 2 0 0 1 2 2 v9 a2 2 0 0 1 -2 2 H 5 a2 2 0 0 1 -2 -2 V 9 a2 2 0 0 1 2 -2 Z" {...S} fill="#fff" />
      <circle cx="12" cy="13" r="3.5" {...S} />
    </svg>
  );
}

export function IconChart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4 20 V 4" {...S} />
      <path d="M4 20 H 20" {...S} />
      <path d="M8 16 v-4 M12 16 V 8 M16 16 v-6" {...S} strokeWidth="2.4" />
    </svg>
  );
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" {...S} fill="#fff" />
      <path d="M3.5 9.5 h17 M8 3 v3.5 M16 3 v3.5" {...S} />
      <circle cx="8.5" cy="14" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <circle cx="15.5" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconCard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" {...S} fill="#fff" />
      <path d="M3 10 h18" {...S} />
      <path d="M6.5 15 h4" {...S} />
    </svg>
  );
}

export function IconInbox({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4 13 L 6 5.5 h12 L 20 13 v5 a2 2 0 0 1 -2 2 H 6 a2 2 0 0 1 -2 -2 Z" {...S} fill="#fff" />
      <path d="M4 13 h5 c0 1.6 1.3 2.8 3 2.8 s3 -1.2 3 -2.8 h5" {...S} />
    </svg>
  );
}

export function IconImage({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" {...S} fill="#fff" />
      <circle cx="9" cy="10" r="1.8" fill={SUN} />
      <path d="M5 18 L 10.5 12.5 L 14 16 L 16.5 13.5 L 20 17" {...S} />
    </svg>
  );
}

export function IconGear({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="3" {...S} fill="#fff" />
      <path
        d="M12 3.5 l1 2.3 2.4 -.7 .5 2.5 2.5 .5 -.7 2.4 2.3 1 -2.3 1 .7 2.4 -2.5 .5 -.5 2.5 -2.4 -.7 -1 2.3 -1 -2.3 -2.4 .7 -.5 -2.5 -2.5 -.5 .7 -2.4 -2.3 -1 2.3 -1 -.7 -2.4 2.5 -.5 .5 -2.5 2.4 .7 Z"
        {...S}
      />
    </svg>
  );
}

export function IconBank({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M3.5 9 L 12 4 L 20.5 9 H 3.5 Z" {...S} fill="#fff" />
      <path d="M5.5 9 v8 M9.8 9 v8 M14.2 9 v8 M18.5 9 v8" {...S} />
      <path d="M3.5 17 h17 M3 20 h18" {...S} />
    </svg>
  );
}

export function IconEuro({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M17.5 6.5 A 7 7 0 1 0 17.5 17.5" {...S} />
      <path d="M4.5 10.2 h8 M4.5 13.8 h7" {...S} />
    </svg>
  );
}

export function IconSync({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M19.5 12 a7.5 7.5 0 1 1 -2.2 -5.3" {...S} />
      <path d="M19.8 3.5 v3.5 h-3.5" {...S} />
    </svg>
  );
}

export function IconUpload({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 15 V 4.5 M8 8 l4 -3.8 4 3.8" {...S} />
      <path d="M4.5 15.5 v3 a2 2 0 0 0 2 2 h11 a2 2 0 0 0 2 -2 v-3" {...S} />
    </svg>
  );
}
