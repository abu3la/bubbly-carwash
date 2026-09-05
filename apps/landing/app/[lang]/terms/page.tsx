import { notFound } from 'next/navigation';
import { strings } from '../../../components/strings';
import styles from '../../../styles/terms.module.css';

type Props = { params: Promise<{ lang: string }> };
export function generateStaticParams() { return [{ lang: 'ar' }, { lang: 'en' }]; }
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return { title: lang === 'en' ? 'Terms and Conditions | BubblesCarWash' : 'الشروط والأحكام | ببلز' };
}
export default async function Terms({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const ar = lang === 'ar';
  const sections = ar ? [
    { title: 'الخدمة والباقات', text: 'تقدم ببلز خدمة غسيل السيارات في الموقع. توضح تفاصيل كل باقة سعرها وعدد الغسلات الأسبوعية، وتخضع المواعيد لنطاق الخدمة والتوافر.' },
    { title: 'الموعد ومسؤولية العميل', text: 'على العميل تقديم بيانات صحيحة للسيارة والموقع، وإتاحة الوصول إلى السيارة في الموعد المتفق عليه لتنفيذ الغسلة.' },
    { title: 'تفويت الموعد وعدم ترحيل الغسلات', text: strings.ar.packages.noRollover, detail: 'إذا فوّت العميل موعد الغسلة المتفق عليه، فلا تُضاف الغسلة الفائتة إلى رصيده، ولا تُرحّل إلى أسبوع لاحق أو دورة اشتراك لاحقة.' },
    { title: 'نطاق تطبيق البند', text: 'يقتصر بند عدم الترحيل عند تفويت الموعد على الحالات التي يكون فيها التفويت من العميل. ولا يشمل إلغاء ببلز للموعد أو تعذّر تقديم الخدمة من طرفها، ولا يخل بحقوق العميل المقررة نظامًا.' },
  ] : [
    { title: 'Service and packages', text: 'Bubbles provides car washing at your location. Each package lists its price and weekly wash allowance. Appointments depend on service coverage and availability.' },
    { title: 'Appointments and customer responsibilities', text: 'Customers must provide accurate vehicle and location details and make the vehicle accessible at the agreed appointment time.' },
    { title: 'Missed appointments and wash credits', text: strings.en.packages.noRollover, detail: 'If the customer misses an agreed wash appointment, the missed wash is not added to their balance and does not carry over to a later week or subscription cycle.' },
    { title: 'Scope of this condition', text: 'This missed-appointment condition applies only when the customer misses the appointment. It does not cover appointments cancelled by Bubbles or services Bubbles is unable to provide, and does not affect the customer’s statutory rights.' },
  ];
  return <div className={styles.page} lang={lang} dir={ar ? 'rtl' : 'ltr'}>
    <header className={styles.header}>
      <a href={`/${lang}`} aria-label={ar ? 'ببلز، الصفحة الرئيسية' : 'Bubbles home'}><img src="/brand/bubbles-logo-src.svg" alt="Bubbles" width="174" height="36" /></a>
      <a href={`/${ar ? 'en' : 'ar'}/terms`} lang={ar ? 'en' : 'ar'}>{ar ? 'English' : 'العربية'}</a>
    </header>
    <main className={styles.content}>
      <h1>{strings[lang].footer.terms}</h1>
      <p className={styles.intro}>{ar ? 'شروط استخدام خدمة ببلز والغسلات ضمن الباقات الأسبوعية.' : 'Terms for using Bubbles and the washes included in weekly packages.'}</p>
      {sections.map((section, i) => <section key={section.title} className={i === 2 ? styles.policy : styles.section}>
        <h2>{section.title}</h2><p>{section.text}</p>{section.detail && <p>{section.detail}</p>}
      </section>)}
      <a className={styles.back} href={`/${lang}#packages`}>{ar ? 'العودة إلى الباقات' : 'Back to packages'}</a>
    </main>
  </div>;
}
