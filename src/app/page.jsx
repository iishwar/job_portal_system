export default function Home() {
  return (
    <div className="page">
      <style>{styles}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <header className="nav">
        <div className="nav__inner">
          <span className="nav__mark">
            North<span className="nav__mark-dot">beam</span>
          </span>
          <nav className="nav__links">
            <a href="/home">Explore Jobs</a>
            <a href="/auth">Sign In</a>
          </nav>
          <a href="/auth" className="nav__cta">
            Get started
          </a>
        </div>
      </header>

      <main className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              Find Jobs Not Posted
              <br />
              on LinkedIn or Indeed
            </h1>

            <p className="hero__subtitle">
              Northbeam scans company career pages, ATS boards and hiring
              team posts the big job sites never index, so you see roles
              days before they show up anywhere else.
            </p>

            <div className="hero__actions">
              <a href="/auth" className="btn btn--primary">
                Get Started Free
              </a>
              <a href="/home" className="btn btn--ghost">
                Browse Jobs
              </a>
            </div>

            <div className="hero__proof">
              <div className="hero__proof-item">
                <span className="hero__proof-num">38,000+</span>
                <span className="hero__proof-label">unlisted roles found</span>
              </div>
              <span className="hero__proof-divider" />
              <div className="hero__proof-item">
                <span className="hero__proof-num">2,600</span>
                <span className="hero__proof-label">companies scanned daily</span>
              </div>
              <span className="hero__proof-divider" />
              <div className="hero__proof-item">
                <span className="hero__proof-num">3-5 days</span>
                <span className="hero__proof-label">earlier than job boards</span>
              </div>
            </div>
          </div>

          <div className="hero__demo" id="demo">
            <div className="demo">
              <div className="demo__bar">
                <div className="demo__dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="demo__bar-title">Overview — Last 7 days</span>
              </div>

              <div className="demo__body">
                <div className="demo__stat-row">
                  <div className="demo__stat">
                    <span className="demo__stat-label">Visitors</span>
                    <span className="demo__stat-value">18,204</span>
                    <span className="demo__stat-delta demo__stat-delta--up">
                      +12.4%
                    </span>
                  </div>
                  <div className="demo__stat">
                    <span className="demo__stat-label">Signups</span>
                    <span className="demo__stat-value">642</span>
                    <span className="demo__stat-delta demo__stat-delta--up">
                      +4.8%
                    </span>
                  </div>
                  <div className="demo__stat">
                    <span className="demo__stat-label">Bounce rate</span>
                    <span className="demo__stat-value">31%</span>
                    <span className="demo__stat-delta demo__stat-delta--down">
                      -2.1%
                    </span>
                  </div>
                </div>

                <div className="demo__chart">
                  <div className="demo__chart-bars">
                    <span style={{ "--h": "38%" }} />
                    <span style={{ "--h": "52%" }} />
                    <span style={{ "--h": "44%" }} />
                    <span style={{ "--h": "61%" }} />
                    <span style={{ "--h": "58%" }} />
                    <span style={{ "--h": "73%" }} />
                    <span className="demo__chart-bars-active" style={{ "--h": "86%" }} />
                  </div>
                  <div className="demo__chart-axis">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                <div className="demo__footer">
                  <span className="demo__live-dot" />
                  <span>Live — updated 4 seconds ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  .page {
    --paper: #FBFBFD;
    --panel: #FFFFFF;
    --ink: #14121C;
    --ink-soft: #5B5867;
    --ink-faint: #8B889A;
    --blue: #3B6FE0;
    --blue-soft: #EAF0FE;
    --violet: #7C5CFF;
    --violet-soft: #F1EDFF;
    --line: #E4E1EC;
    --line-strong: #D4D0E0;
    --blue-dot: rgba(255, 255, 255, 0.22);
    --on-blue-soft: rgba(255, 255, 255, 0.78);
    --on-blue-faint: rgba(255, 255, 255, 0.6);
    --on-blue-line: rgba(255, 255, 255, 0.28);

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* ---------- Nav ---------- */

  .nav {
    border-bottom: 1px solid var(--line);
    background: var(--paper);
  }

  .nav__inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 22px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav__mark {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .nav__mark-dot {
    color: var(--blue);
  }

  .nav__links {
    display: flex;
    gap: 36px;
  }

  .nav__links a {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.15s ease;
  }

  .nav__links a:hover,
  .nav__links a:focus-visible {
    color: var(--ink);
  }

  .nav__cta {
    font-size: 14px;
    font-weight: 600;
    padding: 9px 18px;
    border-radius: 8px;
    background: var(--ink);
    color: var(--paper);
    transition: background 0.15s ease;
  }

  .nav__cta:hover {
    background: var(--blue);
  }

  /* ---------- Hero layout ---------- */

  .hero {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: var(--blue);
    background-image: radial-gradient(var(--blue-dot) 1.5px, transparent 1.5px);
    background-size: 22px 22px;
  }

  .hero__inner {
    max-width: 1180px;
    margin: 0 auto;
    width: 100%;
    padding: 88px 32px 104px;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 64px;
    align-items: center;
  }

  .hero__eyebrow {
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--violet);
    background: var(--violet-soft);
    padding: 6px 12px;
    border-radius: 999px;
    margin: 0 0 24px;
  }

  .hero__title {
    font-size: 52px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -0.025em;
    margin: 0 0 22px;
    color: #FFFFFF;
  }

  .hero__subtitle {
    font-size: 18px;
    line-height: 1.6;
    color: var(--on-blue-soft);
    max-width: 480px;
    margin: 0 0 36px;
  }

  .hero__actions {
    display: flex;
    gap: 14px;
    margin-bottom: 56px;
  }

  .btn {
    font-size: 15px;
    font-weight: 600;
    padding: 13px 24px;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .btn--primary {
    background: var(--violet);
    color: #FFFFFF;
  }

  .btn--primary:hover {
    background: #6A48F0;
  }

  .btn--ghost {
    background: transparent;
    color: #FFFFFF;
    border: 1px solid var(--on-blue-line);
  }

  .btn--ghost:hover {
    border-color: #FFFFFF;
  }

  .hero__proof {
    display: flex;
    align-items: center;
    gap: 24px;
    padding-top: 32px;
    border-top: 1px solid var(--on-blue-line);
    max-width: 480px;
  }

  .hero__proof-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .hero__proof-num {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #FFFFFF;
  }

  .hero__proof-label {
    font-size: 12.5px;
    color: var(--on-blue-faint);
  }

  .hero__proof-divider {
    width: 1px;
    height: 32px;
    background: var(--on-blue-line);
  }

  /* ---------- Demo panel (signature element) ---------- */

  .hero__demo {
    position: relative;
  }

  .demo {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    overflow: hidden;
  }

  .demo__bar {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--line);
    background: var(--paper);
  }

  .demo__dots {
    display: flex;
    gap: 6px;
  }

  .demo__dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--line-strong);
  }

  .demo__bar-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-soft);
  }

  .demo__body {
    padding: 24px;
  }

  .demo__stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .demo__stat {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    border: 1px solid var(--line);
    border-radius: 10px;
  }

  .demo__stat-label {
    font-size: 12px;
    color: var(--ink-faint);
  }

  .demo__stat-value {
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .demo__stat-delta {
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
    padding: 2px 7px;
    border-radius: 5px;
  }

  .demo__stat-delta--up {
    color: var(--blue);
    background: var(--blue-soft);
  }

  .demo__stat-delta--down {
    color: var(--violet);
    background: var(--violet-soft);
  }

  .demo__chart {
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 18px 18px 12px;
    margin-bottom: 18px;
  }

  .demo__chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 120px;
  }

  .demo__chart-bars span {
    flex: 1;
    height: var(--h);
    background: var(--blue-soft);
    border-radius: 4px 4px 0 0;
  }

  .demo__chart-bars-active {
    background: var(--blue) !important;
  }

  .demo__chart-axis {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .demo__chart-axis span {
    font-size: 11px;
    color: var(--ink-faint);
    flex: 1;
    text-align: center;
  }

  .demo__footer {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: var(--ink-faint);
  }

  .demo__live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--blue);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }

  @media (prefers-reduced-motion: reduce) {
    .demo__live-dot {
      animation: none;
    }
  }

  /* ---------- Responsive ---------- */

  @media (max-width: 900px) {
    .hero__inner {
      grid-template-columns: 1fr;
      padding-top: 56px;
      gap: 48px;
    }

    .hero__title {
      font-size: 40px;
    }

    .nav__links {
      display: none;
    }
  }

  @media (max-width: 520px) {
    .hero__title {
      font-size: 32px;
    }

    .hero__actions {
      flex-direction: column;
    }

    .demo__stat-row {
      grid-template-columns: 1fr;
    }
  }
`;