function BubbleField() {
  return (
    <svg className="bubbles" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g>
        <circle cx="880" cy="620" r="60" strokeWidth="1.5" opacity="0.30" />
        <circle cx="1020" cy="380" r="26" strokeWidth="1.2" opacity="0.22" />
        <circle cx="760" cy="240" r="14" strokeWidth="1" opacity="0.18" />
      </g>
      <g>
        <circle cx="960" cy="520" r="90" strokeWidth="1.5" opacity="0.16" />
        <circle cx="1120" cy="640" r="38" strokeWidth="1.2" opacity="0.26" />
        <circle cx="840" cy="420" r="10" strokeWidth="1" opacity="0.20" />
      </g>
      <g>
        <circle cx="1060" cy="220" r="48" strokeWidth="1.3" opacity="0.14" />
        <circle cx="930" cy="140" r="18" strokeWidth="1" opacity="0.20" />
        <circle cx="1150" cy="460" r="12" strokeWidth="1" opacity="0.24" />
      </g>
    </svg>
  );
}

function BrandMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="13" cy="19" r="10" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="24" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2.4" opacity="0.7" />
      <circle cx="27" cy="23" r="3" fill="none" stroke="currentColor" strokeWidth="2.4" opacity="0.45" />
    </svg>
  );
}

const dashboardUrl =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://bubbly-dashboard.example.workers.dev';

export default function Home() {
  return (
    <main className="stage">
      <BubbleField />
      <nav className="top">
        <span className="brand">
          <BrandMark />
          Bubbly
        </span>
        <a className="ops" href={dashboardUrl}>
          Operations
        </a>
      </nav>
      <section className="hero">
        <h1>
          Your car, washed <em>where it stands.</em>
        </h1>
        <p>
          Pick a package, drop a pin, and a Bubbly driver comes to you. No queue, no tunnel, no
          moving your car.
        </p>
        <p className="release-note">Customer app in private testing.</p>
      </section>
      <p className="wordmark" aria-hidden="true">
        BUBBLY
      </p>
    </main>
  );
}
