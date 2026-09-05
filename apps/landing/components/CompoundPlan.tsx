import type { strings } from './strings';
import styles from '../styles/landing.module.css';

/** Original SVG geometry, labels and animation paths from the handoff. */
export function CompoundPlan({ copy }: { copy: typeof strings.ar.hero }) {
  return (
    <figure className={styles.compoundPlan}>
      <svg viewBox="0 0 640 580" role="img" aria-label={copy.artAlt} className={styles.element28}>
        <defs>
          <pattern id="bcwDots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="1.1" fill="var(--white-16)"></circle>
          </pattern>
          <clipPath id="bcwZone">
            <path d="M100 50 L540 42 Q600 40 604 100 L596 460 Q592 512 540 516 L120 524 Q66 526 62 470 L58 100 Q56 52 100 50 Z"></path>
          </clipPath>
          <clipPath id="bcwCar">
            <rect x="268" y="214" width="44" height="22" rx="7"></rect>
          </clipPath>
        </defs>
        <rect x="0" y="0" width="640" height="580" rx="24" fill="var(--landing-plan-ground)"></rect>
        <rect x="0" y="0" width="640" height="580" rx="24" fill="url(#bcwDots)"></rect>
        <g clipPath="url(#bcwZone)">
          <rect x="0" y="0" width="640" height="580" fill="var(--ink)"></rect>
          <g stroke="var(--white-14)" strokeWidth="18" fill="none">
            <line x1="200" y1="40" x2="200" y2="540"></line>
            <line x1="330" y1="40" x2="330" y2="540"></line>
            <line x1="460" y1="40" x2="460" y2="540"></line>
            <line x1="40" y1="170" x2="620" y2="170"></line>
            <line x1="40" y1="280" x2="620" y2="280"></line>
            <line x1="40" y1="390" x2="620" y2="390"></line>
          </g>
          <g fill="var(--landing-block)">
            <rect x="80" y="70" width="110" height="90" rx="10"></rect>
            <rect x="210" y="70" width="110" height="90" rx="10"></rect>
            <rect x="340" y="70" width="110" height="90" rx="10"></rect>
            <rect x="470" y="70" width="110" height="90" rx="10"></rect>
            <rect x="80" y="180" width="110" height="90" rx="10"></rect>
            <rect x="210" y="180" width="110" height="90" rx="10"></rect>
            <rect x="340" y="180" width="110" height="90" rx="10"></rect>
            <rect x="470" y="180" width="110" height="90" rx="10"></rect>
            <rect x="80" y="290" width="110" height="90" rx="10"></rect>
            <rect x="210" y="290" width="110" height="90" rx="10"></rect>
            <rect x="340" y="290" width="110" height="90" rx="10"></rect>
            <rect x="470" y="290" width="110" height="90" rx="10"></rect>
            <rect x="80" y="400" width="110" height="90" rx="10"></rect>
            <rect x="210" y="400" width="110" height="90" rx="10"></rect>
            <rect x="340" y="400" width="110" height="90" rx="10"></rect>
            <rect x="470" y="400" width="110" height="90" rx="10"></rect>
          </g>
          <g fill="var(--landing-building)">
            <rect x="94" y="84" width="34" height="28" rx="5"></rect>
            <rect x="142" y="118" width="34" height="28" rx="5"></rect>
            <rect x="224" y="118" width="34" height="28" rx="5"></rect>
            <rect x="272" y="84" width="34" height="28" rx="5"></rect>
            <rect x="354" y="84" width="34" height="28" rx="5"></rect>
            <rect x="402" y="118" width="34" height="28" rx="5"></rect>
            <rect x="484" y="118" width="34" height="28" rx="5"></rect>
            <rect x="532" y="84" width="34" height="28" rx="5"></rect>
            <rect x="94" y="228" width="34" height="28" rx="5"></rect>
            <rect x="142" y="194" width="34" height="28" rx="5"></rect>
            <rect x="224" y="194" width="34" height="28" rx="5"></rect>
            <rect x="354" y="194" width="34" height="28" rx="5"></rect>
            <rect x="402" y="228" width="34" height="28" rx="5"></rect>
            <rect x="484" y="194" width="34" height="28" rx="5"></rect>
            <rect x="532" y="228" width="34" height="28" rx="5"></rect>
            <rect x="94" y="304" width="34" height="28" rx="5"></rect>
            <rect x="142" y="338" width="34" height="28" rx="5"></rect>
            <rect x="224" y="338" width="34" height="28" rx="5"></rect>
            <rect x="272" y="304" width="34" height="28" rx="5"></rect>
            <rect x="354" y="304" width="34" height="28" rx="5"></rect>
            <rect x="402" y="338" width="34" height="28" rx="5"></rect>
            <rect x="484" y="338" width="34" height="28" rx="5"></rect>
            <rect x="532" y="304" width="34" height="28" rx="5"></rect>
            <rect x="94" y="448" width="34" height="28" rx="5"></rect>
            <rect x="142" y="414" width="34" height="28" rx="5"></rect>
            <rect x="224" y="414" width="34" height="28" rx="5"></rect>
            <rect x="272" y="448" width="34" height="28" rx="5"></rect>
            <rect x="354" y="448" width="34" height="28" rx="5"></rect>
            <rect x="402" y="414" width="34" height="28" rx="5"></rect>
            <rect x="484" y="414" width="34" height="28" rx="5"></rect>
            <rect x="532" y="448" width="34" height="28" rx="5"></rect>
          </g>
        </g>
        <path
          d="M100 50 L540 42 Q600 40 604 100 L596 460 Q592 512 540 516 L120 524 Q66 526 62 470 L58 100 Q56 52 100 50 Z"
          fill="none"
          stroke="var(--ice)"
          strokeWidth="2.5"
        ></path>
        <rect x="318" y="512" width="24" height="12" fill="var(--ink)"></rect>
        <line
          x1="318"
          y1="518"
          x2="342"
          y2="518"
          stroke="var(--violet)"
          strokeWidth="3"
          strokeLinecap="round"
        ></line>
        <path
          d="M330 566 L330 335 L200 335 L200 225 L258 225"
          fill="none"
          stroke="var(--violet-40)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M330 566 L330 335 L200 335 L200 225 L258 225"
          fill="none"
          stroke="var(--violet)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 16"
          className={styles.routeAnimation}
        ></path>
        <rect x="268" y="214" width="44" height="22" rx="7" fill="var(--yellow)"></rect>
        <rect x="276" y="217" width="12" height="16" rx="3" fill="var(--ink-22)"></rect>
        <rect x="294" y="217" width="12" height="16" rx="3" fill="var(--ink-22)"></rect>
        <g clipPath="url(#bcwCar)">
          <rect
            x="262"
            y="206"
            width="10"
            height="40"
            fill="var(--white)"
            transform="skewX(-20)"
            className={styles.shineAnimation}
          ></rect>
        </g>
        <circle
          r="8"
          fill="var(--violet)"
          stroke="var(--white)"
          strokeWidth="3"
          className={styles.teamAnimation}
        ></circle>
        <text
          x="86"
          y="547"
          fill="var(--white-60)"
          fontSize="13"
          fontWeight="600"
          letterSpacing="1"
          className={styles.element26}
        >
          {copy.artOutside}
        </text>
        <text
          x="560"
          y="33"
          fill="var(--ice)"
          fontSize="14"
          fontWeight="700"
          letterSpacing="1"
          className={styles.element27}
        >
          {copy.artZone}
        </text>
        <text
          x="352"
          y="560"
          fill="var(--white)"
          fontSize="13"
          fontWeight="600"
          className={styles.element26}
        >
          {copy.artGate}
        </text>
        <text
          x="318"
          y="204"
          fill="var(--white)"
          fontSize="13"
          fontWeight="600"
          className={styles.element26}
        >
          {copy.artCar}
        </text>
      </svg>
      <figcaption className={styles.element32}>
        <span className={styles.element30}>
          <span aria-hidden="true" className={styles.element29}></span>
          {copy.artRoute}
        </span>
        <span className={styles.element30}>
          <span aria-hidden="true" className={styles.element31}></span>
          {copy.artZoneNote}
        </span>
      </figcaption>
    </figure>
  );
}
