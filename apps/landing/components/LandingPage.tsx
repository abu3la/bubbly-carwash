'use client';
import { Fragment } from 'react';
import { CompoundPlan } from './CompoundPlan';
import { TrackingPreview } from './TrackingPreview';
import { PricingComparison } from './PricingComparison';
import { Button, Input, BeatIcon } from './primitives';
import { useLanding, type LandingOptions } from './useLanding';
import styles from '../styles/landing.module.css';

/** Native React transcription of the approved HTML; no Claude runtime in the app. */
export function LandingPage(props: LandingOptions) {
  const {
    afterView,
    beforeView,
    checkCoverage,
    covChecking,
    covDot,
    covInside,
    covMessage,
    covResult,
    demoChips,
    dir,
    facts,
    goCoverage,
    goTop,
    lang,
    legalLinksReady,
    links,
    menuLabel,
    menuOpen,
    narrow,
    navItems,
    otherDir,
    otherLang,
    periods,
    phoneH,
    phoneW,
    plans,
    pricingError,
    pricingLoading,
    pricingReady,
    query,
    retryPricing,
    setQuery,
    slotsAvailable,
    slotsNone,
    steps,
    t,
    toggleLang,
    toggleMenu,
    villaLine,
    wide,
  } = useLanding(props);
  return (
    <div dir={dir} lang={lang} className={styles.page}>
      <header className={styles.header}>
        <nav aria-label="Main" className={styles.navigation}>
          <a href="#top" onClick={goTop} className={styles.brandLink}>
            <img
              src="/brand/bubbles-logo-src.svg"
              alt="Bubbles"
              className={styles.logoImage}
            />
          </a>
          {wide && (
            <>
              <ul className={styles.navLinks}>
                {navItems.map((item, index) => (
                  <Fragment key={index}>
                    <li>
                      <a
                        href={'#' + item.id}
                        onClick={item.go}
                        aria-current={item.current}
                        className={styles.navLink}
                        style={{ color: item.color, fontWeight: item.weight }}
                      >
                        {item.label}
                      </a>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </>
          )}
          <div className={styles.navActions}>
            <button
              type="button"
              onClick={toggleLang}
              aria-label={t.nav.switchAria}
              lang={otherLang}
              dir={otherDir}
              className={styles.languageButton}
            >
              {t.nav.switchLabel}
            </button>
            {wide && (
              <>
                <Button variant="primary" size="md" disabled>
                  {t.nav.book}
                </Button>
              </>
            )}
            {narrow && (
              <>
                <button
                  type="button"
                  onClick={toggleMenu}
                  aria-expanded={menuOpen}
                  aria-controls="bcw-menu"
                  className={styles.menuButton}
                >
                  {menuLabel}
                </button>
              </>
            )}
          </div>
        </nav>
        {menuOpen && (
          <>
            <ul id="bcw-menu" className={styles.menuList}>
              {navItems.map((item, index) => (
                <Fragment key={index}>
                  <li>
                    <a
                      href={'#' + item.id}
                      onClick={item.go}
                      aria-current={item.current}
                      className={styles.menuLink}
                      style={{ color: item.color, fontWeight: item.weight }}
                    >
                      {item.label}
                    </a>
                  </li>
                </Fragment>
              ))}
              <li className={styles.menuCta}>
                <Button
                  variant="primary"
                  size="lg"
                  disabled
                  className={styles.fullWidth}
                >
                  {t.nav.book}
                </Button>
              </li>
            </ul>
          </>
        )}
      </header>
      <main id="top">
        <section id="service" data-screen-label="Hero" className={styles.darkSection}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>
                {t.hero.brand} · {t.hero.tagline}
              </p>
              <h1 className={styles.heroTitle}>{t.hero.title}</h1>
              <p className={styles.heroDescription}>{t.hero.desc}</p>
              <div className={styles.heroActions}>
                <Button variant="primary" size="lg" disabled>
                  {t.hero.cta}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={goCoverage}
                  className={styles.heroSecondary}
                >
                  {t.hero.ctaCoverage}
                </Button>
              </div>
              <p className={styles.heroCoverage}>
                <span aria-hidden="true" className={styles.coverageDot}></span>
                {t.hero.coverage}
              </p>
              <p className="bcw-demo-disclosure">
                {lang === 'ar'
                  ? 'معاينة تصميم: بيانات الفلل والمواعيد تجريبية ولا تؤكد التغطية الفعلية.'
                  : 'Design preview: villa records and time slots are examples, not confirmation of service coverage.'}
              </p>
            </div>

            <CompoundPlan copy={t.hero} />
          </div>
        </section>

        <section id="how" data-screen-label="Journey" className={styles.paddedSection}>
          <p className={styles.element36}>{t.journey.label}</p>
          <h2 className={styles.element37}>{t.journey.title}</h2>
          <ol className={styles.element47}>
            {steps.map((s, index) => (
              <Fragment key={index}>
                <li className={styles.element46}>
                  <div aria-hidden="true" className={styles.element41}>
                    <span className={styles.element38}></span>
                    <span className={styles.element39} style={{ width: s.fill }}></span>
                    <span className={styles.element40} style={{ background: s.dot }}></span>
                  </div>
                  <div className={styles.element45}>
                    <span className={styles.element42}>{s.n}</span>
                    <h3 className={styles.element43}>{s.title}</h3>
                    <p className={styles.element44}>{s.text}</p>
                  </div>
                </li>
              </Fragment>
            ))}
          </ol>
        </section>

        <section id="trust" data-screen-label="Trust" className={styles.insetSection}>
          <div className={styles.trustGrid}>
            <div className={styles.element55}>
              <p className={styles.element49}>{t.trust.label}</p>
              <h2 className={styles.element50}>{t.trust.title}</h2>
              <p className={styles.element51}>{t.trust.copy}</p>
              <dl className={styles.element54}>
                {facts.map((f, index) => (
                  <Fragment key={index}>
                    <dt className={styles.element52}>{f.k}</dt>
                    <dd className={styles.element53}>{f.v}</dd>
                  </Fragment>
                ))}
              </dl>
            </div>
            <div className={styles.trustPreviews}>
              <div className={styles.phoneComparison}>
                <TrackingPreview
                  view={beforeView}
                  copy={t.trust}
                  dir={dir}
                  phoneW={phoneW}
                  phoneH={phoneH}
                />
                <TrackingPreview
                  view={afterView}
                  copy={t.trust}
                  dir={dir}
                  phoneW={phoneW}
                  phoneH={phoneH}
                />
              </div>
              <p className={styles.previewCaption}>
                {lang === 'ar'
                  ? 'نموذج توضيحي لمتتبع الغسلة. صور السيارة الأصلية غير مرفقة.'
                  : 'Illustrative wash-tracker preview. Original car photos were not supplied.'}
              </p>
            </div>
          </div>
        </section>

        <section id="packages" data-screen-label="Packages" className={styles.insetSection}>
          <div className={styles.element94}>
            <p className={styles.element36}>{t.packages.label}</p>
            <h2 className={styles.pricingTitle}>{t.packages.title}</h2>
            {pricingLoading && (
              <>
                <div role="status" className={styles.element79}>
                  <BeatIcon size="sm" animate={true}></BeatIcon>
                  {t.packages.loading}
                </div>
              </>
            )}
            {pricingError && (
              <>
                <div role="alert" className={styles.element80}>
                  <span>{t.packages.error}</span>
                  <Button variant="secondary" size="md" onClick={retryPricing}>
                    {t.packages.retry}
                  </Button>
                </div>
              </>
            )}
            {pricingReady && (
              <>
                <PricingComparison plans={plans} lang={lang} copy={t.packages} />
              </>
            )}
          </div>
        </section>

        <section id="coverage" data-screen-label="Coverage" className={styles.darkSection}>
          <div className={styles.element122}>
            <div className={styles.element55}>
              <p className={styles.element49}>{t.coverage.label}</p>
              <h2 className={styles.element50}>{t.coverage.title}</h2>
              <p className={styles.element95}>{t.coverage.copy}</p>
              <p className={styles.element96}>{t.coverage.outsideNote}</p>
            </div>
            <form onSubmit={checkCoverage} className={styles.element121}>
              <div className={styles.element100}>
                <div className={styles.element97}>
                  <Input
                    label={t.coverage.inputLabel}
                    hint={t.coverage.inputHint}
                    value={query}
                    onChange={setQuery}
                    name="villa"
                    inputMode="numeric"
                    autoComplete="off"
                    dir="ltr"
                  ></Input>
                </div>
                <div className={styles.element99}>
                  <Button variant="primary" size="md" type="submit" className={styles.element98}>
                    {t.coverage.check}
                  </Button>
                </div>
              </div>
              <div className={styles.element103}>
                <span className={styles.element101}>
                  {lang === 'ar'
                    ? 'أمثلة تجريبية، ليست مواعيد فعلية'
                    : 'Demo examples, not live availability'}
                </span>
                {demoChips.map((c, index) => (
                  <Fragment key={index}>
                    <button type="button" onClick={c.pick} className={styles.element102}>
                      {c.label}
                    </button>
                  </Fragment>
                ))}
              </div>
              <div role="status" aria-live="polite" className={styles.coverageStatus}>
                {covChecking && (
                  <>
                    <p className={styles.element104}>
                      <BeatIcon size="sm" animate={true}></BeatIcon>
                      {t.coverage.checking}
                    </p>
                  </>
                )}
                {covResult && (
                  <>
                    <div className={styles.coverageResult}>
                      <p className={styles.element107}>
                        <span
                          aria-hidden="true"
                          className={styles.element105}
                          style={{ background: covDot }}
                        ></span>
                        <span>
                          {covMessage}
                          {covInside && (
                            <>
                              {' '}
                              <span className={styles.element106}>{villaLine}</span>{' '}
                            </>
                          )}
                        </span>
                      </p>
                      {covInside && (
                        <>
                          <div className={styles.element118}>
                            <div className={styles.element109}>
                              <span>{t.coverage.slotsTitle}</span>
                              <span className={styles.element108}>{t.coverage.slotsDate}</span>
                            </div>
                            {slotsAvailable && (
                              <>
                                <ul className={styles.periodGrid}>
                                  {periods.map((pr, index) => (
                                    <Fragment key={index}>
                                      <li
                                        className={styles.element113}
                                        style={{ background: pr.bg, color: pr.fg }}
                                      >
                                        <span className={styles.element110}>{pr.name}</span>
                                        <span className={styles.periodRange}>{pr.range}</span>
                                        <span className={styles.element112}>{pr.status}</span>
                                      </li>
                                    </Fragment>
                                  ))}
                                </ul>
                              </>
                            )}
                            {slotsNone && (
                              <>
                                <p className={styles.element115}>{t.coverage.slotsNone}</p>
                              </>
                            )}
                            <div className={styles.element117}>
                              <Button
                                variant="primary"
                                size="lg"
                                disabled={true}
                                aria-disabled="true"
                              >
                                {t.coverage.subscribe}
                              </Button>
                              <span className={styles.element116}>{t.coverage.subscribeNote}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </section>

      </main>

      <footer id="support" className={styles.footer}>
        <div className={styles.element142}>
          <div className={styles.element136}>
            <div className={styles.element133}>
              <img
                src="/brand/bubbles-logo-src.svg"
                alt="Bubbles"
                className={styles.logoImage}
              />
            </div>
            <p className={styles.element134}>{t.hero.tagline}</p>
            <p className={styles.element135}>{t.footer.coverage}</p>
          </div>
          <div className={styles.element141}>
            {legalLinksReady && (
              <>
                <ul className={styles.element138}>
                  <li>
                    <a href={links.support} className={styles.element137}>
                      {t.footer.support}
                    </a>
                  </li>
                  <li>
                    <a href={links.privacy} className={styles.element137}>
                      {t.footer.privacy}
                    </a>
                  </li>
                  <li>
                    <a href={links.deleteAccount} className={styles.element137}>
                      {t.footer.deleteAccount}
                    </a>
                  </li>
                </ul>
              </>
            )}
            <a href={`/${lang}/terms`} className={styles.element137}>{t.footer.terms}</a>
            <div className={styles.element140}>
              <span>{t.footer.lang}</span>
              <button
                type="button"
                onClick={toggleLang}
                aria-label={t.nav.switchAria}
                lang={otherLang}
                dir={otherDir}
                className={styles.element139}
              >
                {t.nav.switchLabel}
              </button>
            </div>
          </div>
        </div>
        {/* Keep downloads hidden until the official store destinations are available. */}
        <div hidden data-app-downloads>
          <Button variant="dark" disabled>
            {lang === 'ar' ? 'تحميل من App Store' : 'Download on the App Store'}
          </Button>
          <Button variant="dark" disabled>
            {lang === 'ar' ? 'تحميل من Google Play' : 'Get it on Google Play'}
          </Button>
        </div>
      </footer>
    </div>
  );
}
