'use client';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { strings, type Language } from './strings';
import coverage from '../../../design/claude/project/coverage-config.json';

export interface LandingOptions {
  initialLang: Language;
  pricingState?: 'live' | 'error' | 'loading';
  slotsDemo?: 'available' | 'none';
}
interface Catalogue {
  services: { key: string; name: { ar: string; en: string }; priceMinor: number }[];
  plans: { id: string; name: { ar: string; en: string }; priceMinor: number; weekly: number }[];
}
type CoverageResult = 'inside' | 'unserved' | 'error' | null;

export function useLanding({
  initialLang,
  pricingState = 'live',
  slotsDemo = 'available',
}: LandingOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState(initialLang);
  const t = strings[lang];
  const [wide, setWide] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState('service');
  const [stage, setStage] = useState(0);
  const [pricing, setPricing] = useState<Catalogue | null>(null);
  const [pricingStatus, setPricingStatus] = useState('loading');
  const [query, updateQuery] = useState('');
  const [covStatus, setCovStatus] = useState('idle');
  const [result, setResult] = useState<CoverageResult>(null);
  const [villa, setVilla] = useState<(typeof coverage.villas)[number] | null>(null);
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchController = useRef<AbortController | null>(null);

  const retryPricing = useCallback(async () => {
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;
    setPricingStatus('loading');
    try {
      const response = await fetch('/api/pricing', { signal: controller.signal });
      if (!response.ok) throw new Error('catalogue unavailable');
      const data = (await response.json()) as Catalogue;
      if (!Array.isArray(data.services) || !Array.isArray(data.plans))
        throw new Error('invalid catalogue');
      if (!controller.signal.aborted) {
        setPricing(data);
        setPricingStatus('ready');
      }
    } catch {
      if (!controller.signal.aborted) setPricingStatus('error');
    }
  }, []);

  useEffect(() => {
    if (pricingState === 'error') setPricingStatus('error');
    else if (pricingState === 'loading') setPricingStatus('loading');
    else void retryPricing();
    return () => {
      fetchController.current?.abort();
    };
  }, [pricingState, retryPricing]);

  useEffect(() => {
    if (pathname !== '/') {
      setLang(initialLang);
      return;
    }
    try {
      if (localStorage.getItem('bcw-lang') === 'en') {
        setLang('en');
        router.replace('/en');
      }
    } catch {
      /* Storage can be disabled. */
    }
  }, [initialLang, pathname, router]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = strings[lang].dir;
    document.title = strings[lang].seo.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', strings[lang].seo.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', strings[lang].seo.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', strings[lang].seo.description);
  }, [lang]);

  useEffect(() => {
    const media = matchMedia('(min-width: 960px)');
    const resize = () => {
      setWide(media.matches);
      if (media.matches) setMenuOpen(false);
    };
    resize();
    media.addEventListener('change', resize);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    const motion = () => {
      clearInterval(timer);
      if (!reduced.matches) timer = setInterval(() => setStage((s) => (s + 1) % 4), 2400);
    };
    motion();
    reduced.addEventListener('change', motion);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    document.querySelectorAll('main section, footer').forEach((el) => observer.observe(el));
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        document.querySelector<HTMLButtonElement>('[aria-controls="bcw-menu"]')?.focus();
      }
    };
    window.addEventListener('keydown', escape);
    return () => {
      media.removeEventListener('change', resize);
      reduced.removeEventListener('change', motion);
      clearInterval(timer);
      observer.disconnect();
      window.removeEventListener('keydown', escape);
      if (checkTimer.current) clearTimeout(checkTimer.current);
    };
  }, []);

  const scrollTo = (id: string) => (event?: MouseEvent<HTMLElement>) => {
    event?.preventDefault();
    setMenuOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
        setCurrent(id);
      }
    });
  };
  const runCheck = (raw: string) => {
    if (checkTimer.current) clearTimeout(checkTimer.current);
    setCovStatus('checking');
    setResult(null);
    setVilla(null);
    checkTimer.current = setTimeout(() => {
      const normalized = raw
        .trim()
        .replace(/[٠-٩]/g, (n) => String(n.charCodeAt(0) - 0x660))
        .replace(/[۰-۹]/g, (n) => String(n.charCodeAt(0) - 0x6f0))
        .toUpperCase();
      const found = coverage.villas.find((v) => v.no.toUpperCase() === normalized);
      setResult(
        !new RegExp(coverage.villaFormat).test(normalized)
          ? 'error'
          : found
            ? 'inside'
            : 'unserved',
      );
      setVilla(found ?? null);
      setCovStatus('done');
    }, 700);
  };
  const otherLang: Language = lang === 'ar' ? 'en' : 'ar';
  const money = (minor: number) => (lang === 'ar' ? `${minor / 100} ر.س.` : `SAR ${minor / 100}`);
  const plans = pricing
    ? [
        ...pricing.services
          .filter((s) => s.key === 'exterior')
          .map((s) => ({
            name: s.name[lang],
            weekly: 0,
            freq: '—',
            price: money(s.priceMinor),
            period: t.packages.once,
          })),
        ...pricing.plans.map((p) => ({
          name: p.name[lang],
          weekly: p.weekly,
          freq:
            lang === 'ar'
              ? p.weekly === 2
                ? 'غسلتان أسبوعيًا'
                : `${p.weekly} غسلات أسبوعيًا`
              : `${p.weekly} washes per week`,
          price: money(p.priceMinor),
          period: t.packages.perMonth,
        })),
      ]
    : [];
  const mkView = (
    active: number,
    label: string,
    dot: string,
    photoLabel: string,
    slot: string,
  ) => ({
    stage: active,
    label,
    dot,
    photoLabel,
    slot,
    steps: t.trust.appSteps.map((s, i) => ({
      ...s,
      copy: i < active ? s.copy : t.trust.appWaiting,
      time: i < active ? s.time : '—',
      opacity: i < active ? 1 : 0.38,
    })),
  });
  return {
    t,
    lang,
    dir: t.dir as 'rtl' | 'ltr',
    otherLang,
    otherDir: otherLang === 'ar' ? 'rtl' : 'ltr',
    wide,
    narrow: !wide,
    menuOpen,
    menuLabel: menuOpen ? t.nav.close : t.nav.menu,
    navItems: [
      ['service', t.nav.service],
      ['how', t.nav.how],
      ['packages', t.nav.packages],
      ['coverage', t.nav.coverage],
    ].map(([id, label]) => ({
      id,
      label,
      go: scrollTo(id),
      current: current === id ? ('true' as const) : undefined,
      color: current === id ? 'var(--violet)' : 'var(--ink-72)',
      weight: current === id ? 600 : 400,
    })),
    steps: t.journey.steps.map((s, i) => ({
      ...s,
      n: String(i + 1).padStart(2, '0'),
      dot: i <= stage ? 'var(--violet)' : 'var(--ink-16)',
      fill: i < stage ? '100%' : i === stage ? '50%' : '0%',
    })),
    facts: t.trust.facts,
    legalLinksReady: false,
    links: { support: '', privacy: '', terms: '', deleteAccount: '' },
    toggleLang: () => {
      try {
        localStorage.setItem('bcw-lang', otherLang);
      } catch {
        /* Language switch must work without storage. */
      }
      setLang(otherLang);
      setMenuOpen(false);
      router.push('/' + otherLang, { scroll: false });
    },
    toggleMenu: () => setMenuOpen((s) => !s),
    goTop: scrollTo('top'),
    goCoverage: scrollTo('coverage'),
    beforeView: mkView(1, t.trust.before, 'var(--violet)', t.trust.photoBefore, t.trust.beforeSlot),
    afterView: mkView(3, t.trust.after, 'var(--yellow)', t.trust.photoAfter, t.trust.afterSlot),
    phoneW: 360,
    phoneH: 800,
    pricingLoading: pricingStatus === 'loading',
    pricingError: pricingStatus === 'error',
    pricingReady: pricingStatus === 'ready',
    plans,
    retryPricing,
    query,
    setQuery: (event: ChangeEvent<HTMLInputElement>) => {
      if (checkTimer.current) clearTimeout(checkTimer.current);
      updateQuery(event.target.value);
      setCovStatus('idle');
      setResult(null);
    },
    demoChips: coverage.demoInputs.map((d) => ({
      label: (lang === 'ar' ? 'فيلا ' : 'Villa ') + d.value,
      pick: () => {
        updateQuery(d.value);
        runCheck(d.value);
      },
    })),
    villaLine: villa ? `${t.coverage.villaPrefix} ${villa.no} · ${villa.street[lang]}` : '',
    checkCoverage: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      runCheck(query);
    },
    covChecking: covStatus === 'checking',
    covResult: covStatus === 'done' && !!result,
    covInside: result === 'inside',
    covMessage: result ? t.coverage.states[result] : '',
    covDot: result === 'inside' ? 'var(--yellow)' : 'var(--guava)',
    slotsAvailable: slotsDemo === 'available',
    slotsNone: slotsDemo === 'none',
    periods: t.coverage.periods.map((p, i) => ({
      ...p,
      status: i === 0 ? t.coverage.slotsFull : t.coverage.slotsAvail,
      bg: i === 0 ? 'var(--white-08)' : 'var(--ice)',
      fg: i === 0 ? 'var(--white)' : 'var(--ink)',
    })),
  };
}
