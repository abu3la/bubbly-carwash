import { Fragment, useEffect, useRef, useState } from 'react';
import { IOSDevice, BookingTicket, BeatIcon, StatusBadge } from './primitives';
import type { useLanding } from './useLanding';
import type { strings } from './strings';
import styles from '../styles/landing.module.css';

/** The two states share one preview component, preserving the supplied phone frame. */
export function TrackingPreview({
  view,
  copy,
  dir,
  phoneW,
  phoneH,
}: {
  view: ReturnType<typeof useLanding>['beforeView'];
  copy: typeof strings.ar.trust;
  dir: 'rtl' | 'ltr';
  phoneW: number;
  phoneH: number;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / phoneW));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [phoneW]);
  return (
    <div className={styles.phonePreview}>
      <span className={styles.element57}>
        <span
          aria-hidden="true"
          className={styles.element56}
          style={{ background: view.dot }}
        ></span>
        {view.label}
      </span>
      <div ref={stageRef} className={styles.phoneStage} style={{ aspectRatio: `${phoneW} / ${phoneH}` }}>
        <div className={styles.phoneCanvas} style={{ width: phoneW, transform: `scale(${scale})` }}>
          <IOSDevice width={phoneW} height={phoneH}>
            <div dir={dir} className={styles.element70}>
              <div className={styles.element58}>{copy.appTitle}</div>
              <BookingTicket time={copy.appSlot} meta={copy.appMeta}></BookingTicket>
              <div className={styles.element66}>
                <div className={styles.element60}>
                  <span className={styles.element59}>{copy.appStatus}</span>
                  <BeatIcon size="md" active={view.stage}></BeatIcon>
                </div>
                {view.steps.map((st, index) => (
                  <Fragment key={index}>
                    <div className={styles.element65} style={{ opacity: st.opacity }}>
                      <StatusBadge status={st.key} size="sm"></StatusBadge>
                      <div className={styles.element63}>
                        <div className={styles.element61}>{st.title}</div>
                        <div className={styles.element62}>{st.copy}</div>
                      </div>
                      <span className={styles.element64}>{st.time}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className={styles.element69}>
                <span className={styles.element59}>{view.photoLabel}</span>
                <div role="img" aria-label={view.slot} className={styles.element68}>
                  <svg
                    viewBox="0 0 96 40"
                    width="96"
                    height="40"
                    aria-hidden="true"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 27h80v-6l-10-3-12-10H34L20 18l-10 3z"></path>
                    <path d="M34 8l-4 10h36l-8-10"></path>
                    <circle cx="24" cy="30" r="6" fill="var(--ice)"></circle>
                    <circle cx="72" cy="30" r="6" fill="var(--ice)"></circle>
                  </svg>
                  <span className={styles.element67}>{view.slot}</span>
                </div>
              </div>
            </div>
          </IOSDevice>
        </div>
      </div>
    </div>
  );
}
