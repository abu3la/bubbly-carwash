import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  admin, ApiError, type CoverageArea, type CoverageAreaInput, type CoverageBlock,
  type CoverageBlockInput, type CoveragePoint, type CoverageSnapshot,
} from '../api';
import './coverage.css';

type Save = (job: () => Promise<unknown>, message: string) => Promise<boolean>;
const numerals = (value: string) => value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
  .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
const villaNumbers = (value: string) => [...new Set(numerals(value).toUpperCase().split(/[\s,،;؛]+/).filter(Boolean))];
const fieldError = (error: unknown) => {
  if (error instanceof ApiError) {
    const messages: Record<string, string> = {
      validation: 'راجع الحقول وأدخل القيم المطلوبة.',
      validationError: 'راجع الحقول وأدخل القيم المطلوبة.',
      invalidCoverageInput: 'راجع الحقول وأدخل القيم المطلوبة.',
      invalidVillaNumber: 'راجع أرقام الفلل. يجب أن يحتوي كل رقم فيلا على رقم واحد على الأقل.',
      duplicateCoverageEntry: 'أحد الرموز أو أرقام الفلل مسجل مسبقًا. راجع السجل قبل الإضافة.',
      coverageReferenceNotFound: 'تعذّر العثور على النطاق أو الفريق. حدّث البيانات وحاول مرة أخرى.',
      boundaryRequired: 'أضف 3 نقاط حدود صحيحة على الأقل قبل اعتماد النطاق.',
      invalidBoundary: 'راجع نقاط الحدود. يجب أن تشكّل نطاقًا مغلقًا دون تقاطع.',
      coverageBlockExists: 'رمز البلوك مستخدم في هذا النطاق. اختر رمزًا آخر.',
      blockExists: 'رمز البلوك مستخدم في هذا النطاق. اختر رمزًا آخر.',
      villaExists: 'أحد أرقام الفلل مسجل مسبقًا. راجع السجل قبل الإضافة.',
      coverageVillaExists: 'أحد أرقام الفلل مسجل مسبقًا. راجع السجل قبل الإضافة.',
      inactiveTeam: 'الفريق غير نشط. فعّل الفريق من صفحة فرق التشغيل.',
      notFound: 'لم يعد هذا السجل متاحًا. حدّث الصفحة.',
    };
    if (messages[error.code]) return messages[error.code];
    if (error.status === 409) return 'أحد الرموز أو أرقام الفلل مستخدم مسبقًا. راجع السجل.';
    if (error.status === 400) return 'راجع الحقول وحدود النطاق ثم حاول مرة أخرى.';
  }
  return 'تعذّر حفظ التغييرات. تحقق من اتصالك وحاول مرة أخرى.';
};

export function Coverage() {
  const [data, setData] = useState<CoverageSnapshot | null>(null);
  const [areaId, setAreaId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [addArea, setAddArea] = useState(false);
  const [revision, setRevision] = useState(0);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try { setData(await admin.coverage()); }
    catch { setError('تعذّر تحميل نطاقات التغطية. حاول مرة أخرى.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);

  const save: Save = async (job, message) => {
    setBusy(true); setError(null); setNotice(null);
    try {
      await job();
      setNotice(message);
      try { setData(await admin.coverage()); setRevision((value) => value + 1); }
      catch { setError('حُفظ التغيير، وتعذّر تحديث العرض. حدّث الصفحة لعرض أحدث البيانات.'); }
      return true;
    } catch (cause) { setError(fieldError(cause)); return false; }
    finally { setBusy(false); }
  };

  const area = data?.areas.find((item) => item.id === areaId) ?? data?.areas[0];
  const block = area?.blocks.find((item) => item.id === blockId) ?? area?.blocks[0];
  const teams = data?.teams ?? [];
  const activeVillas = area?.blocks.flatMap((item) => item.villas).filter((villa) => villa.active).length ?? 0;
  const liveVillas = area?.active && area.boundary_verified
    ? area.blocks.filter((item) => item.active && teams.some((team) => team.id === item.team_id && team.active))
      .flatMap((item) => item.villas).filter((villa) => villa.active).length : 0;

  return <div className="coverage-page">
    <header className="coverage-heading">
      <div><h1>نطاق التغطية</h1><p>حدّد المنطقة، اربط كل بلوك بفريق، ثم أضف أرقام الفلل المتاحة.</p></div>
      <button className="ghost" disabled={loading || busy} onClick={() => void refresh()}>{loading ? 'جارٍ التحديث…' : 'تحديث البيانات'}</button>
    </header>

    {error ? <div className="coverage-feedback error" role="alert">{error}</div> : null}
    {notice ? <div className="coverage-feedback" role="status">{notice}</div> : null}
    {!data ? <div className="coverage-loading" aria-busy={loading}>
      <p>{loading ? 'جارٍ تحميل النطاقات والفلل…' : 'لا يمكن عرض التغطية الآن.'}</p>
      {!loading ? <button onClick={() => void refresh()}>إعادة المحاولة</button> : null}
    </div> : <>
      <div className="coverage-area-switch">
        {data.areas.length > 1 ? <label className="coverage-field"><span>النطاق</span>
          <select value={area?.id ?? ''} disabled={busy} onChange={(event) => { setAreaId(event.target.value); setBlockId(''); setNotice(null); }}>
            {data.areas.map((item) => <option value={item.id} key={item.id}>{item.name_ar} · {item.city}</option>)}
          </select>
        </label> : <p className="coverage-muted">التغطية تبدأ من شربتلي فيلج في جدة.</p>}
        <button className="ghost" aria-expanded={addArea} disabled={busy} onClick={() => setAddArea(!addArea)}>{addArea ? 'إغلاق النموذج' : 'إضافة نطاق'}</button>
      </div>
      {addArea ? <section className="coverage-panel"><h2>نطاق جديد</h2>
        <AreaForm busy={busy} save={save} onSaved={() => setAddArea(false)} />
      </section> : null}

      {area ? <>
        <section className="coverage-territory" aria-label="حالة النطاق">
          <div className="coverage-territory-title">
            <div><h2>{area.name_ar}</h2><p><bdi>{area.name_en}</bdi> · {area.city}</p></div>
            <span className="coverage-territory-state">{!area.active ? 'النطاق متوقف' : liveVillas ? 'التغطية متاحة' : 'بانتظار تجهيز التغطية'}</span>
          </div>
          <dl className="coverage-totals">
            <div><dt>البلوكات</dt><dd>{area.blocks.length}</dd></div>
            <div><dt>أرقام الفلل المفعّلة</dt><dd>{activeVillas}</dd></div>
            <div><dt>الفلل المتاحة للحجز</dt><dd>{liveVillas}</dd></div>
          </dl>
          <div className="coverage-readiness">
            <span>{area.boundary_verified ? 'الحدود الجغرافية معتمدة' : 'الحدود الجغرافية تحتاج اعتمادًا'}</span>
            <span>{area.blocks.some((item) => item.active && teams.some((team) => team.id === item.team_id && team.active)) ? 'الفريق المسؤول جاهز' : 'حدّد فريقًا نشطًا للبلوك'}</span>
            <span>{activeVillas ? 'سجل الفلل جاهز' : 'أضف أرقام الفلل لفتح الحجز'}</span>
          </div>
        </section>

        <details className="coverage-disclosure">
          <summary>إعدادات النطاق والحدود الجغرافية <span>{area.boundary_verified ? 'معتمدة' : 'تحتاج إعدادًا'}</span></summary>
          <AreaForm key={`${area.id}-${revision}`} area={area} busy={busy} save={save} />
        </details>

        <section className="coverage-blocks-section">
          <div className="coverage-section-heading"><h2>توزيع البلوكات</h2><p>تقسيم تشغيلي، وليس خريطة جغرافية.</p></div>
          <div className="coverage-blocks" aria-label="اختر بلوكًا لعرض فلله">
            {area.blocks.map((item) => {
              const team = teams.find((entry) => entry.id === item.team_id);
              return <button className={`coverage-block${item.id === block?.id ? ' selected' : ''}`} key={item.id}
                aria-pressed={item.id === block?.id} disabled={busy} onClick={() => { setBlockId(item.id); setNotice(null); }}>
                <span className="coverage-block-code"><span>بلوك</span><strong dir="ltr">{item.code}</strong></span>
                <span className="coverage-block-details"><strong><bdi>{team?.name_en || team?.name_ar || 'فريق غير محدد'}</bdi></strong>
                  <span>أرقام الفلل: {item.villas.filter((villa) => villa.active).length}</span>
                  <span>{!item.active ? 'البلوك متوقف' : team?.active ? 'الفريق نشط' : 'الفريق غير نشط'}</span>
                </span>
              </button>;
            })}
          </div>
          {!area.blocks.length ? <p className="coverage-empty">لا توجد بلوكات بعد. أضف أول بلوك وحدّد الفريق المسؤول.</p> : null}
          <details className="coverage-disclosure compact">
            <summary>إضافة بلوك</summary>
            <BlockForm key={`new-${area.id}-${revision}`} areaId={area.id} teams={teams} busy={busy} save={save} />
          </details>
        </section>

        {block ? <section className="coverage-registry" aria-labelledby="registry-title">
          <div className="coverage-section-heading"><div><h2 id="registry-title">فلل بلوك <bdi>{block.code}</bdi></h2><p>رقم الفيلا يحدد أهلية الحجز بعد التحقق من موقع العميل.</p></div></div>
          <details className="coverage-disclosure compact">
            <summary>الفريق المسؤول وإعدادات البلوك <span><bdi>{teams.find((team) => team.id === block.team_id)?.name_en}</bdi></span></summary>
            <BlockForm key={`${block.id}-${revision}`} areaId={area.id} block={block} teams={teams} busy={busy} save={save} />
          </details>
          <VillaRegistry key={block.id} area={area} block={block} teamActive={teams.some((team) => team.id === block.team_id && team.active)} busy={busy} save={save} />
        </section> : null}
      </> : <p className="coverage-empty">لا توجد نطاقات بعد. أضف نطاقًا لتجهيز التغطية.</p>}
    </>}
  </div>;
}

function AreaForm({ area, busy, save, onSaved }: { area?: CoverageArea; busy: boolean; save: Save; onSaved?: () => void }) {
  const [nameAr, setNameAr] = useState(area?.name_ar ?? '');
  const [nameEn, setNameEn] = useState(area?.name_en ?? '');
  const [city, setCity] = useState(area?.city ?? 'جدة');
  const [points, setPoints] = useState(area?.boundary.map((point) => `${point.lat}, ${point.lng}`).join('\n') ?? '');
  const [verified, setVerified] = useState(area?.boundary_verified ?? false);
  const [active, setActive] = useState(area?.active ?? true);
  const [error, setError] = useState<string | null>(null);
  const parsed = parseBoundary(points);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(null);
    if (parsed.error) { setError(parsed.error); return; }
    if (verified && parsed.points.length < 3) { setError('أضف 3 نقاط حدود على الأقل قبل اعتماد النطاق.'); return; }
    const body: CoverageAreaInput = { nameAr: nameAr.trim(), nameEn: nameEn.trim(), city: city.trim(), boundary: parsed.points, boundaryVerified: verified, active };
    if (!body.nameAr || !body.nameEn || !body.city) { setError('أدخل اسم النطاق بالعربية والإنجليزية والمدينة.'); return; }
    const success = await save(() => area ? admin.updateCoverageArea(area.id, body) : admin.createCoverageArea(body), area ? 'حُفظت إعدادات النطاق.' : 'أُضيف النطاق. يمكنك الآن إضافة البلوكات.');
    if (success) onSaved?.();
  };
  return <form className="coverage-form" onSubmit={(event) => void submit(event)}>
    <fieldset disabled={busy}>
      <div className="coverage-form-grid">
        <label className="coverage-field"><span>اسم النطاق بالعربية</span><input type="text" value={nameAr} onChange={(event) => setNameAr(event.target.value)} required minLength={2} maxLength={100} /></label>
        <label className="coverage-field"><span>اسم النطاق بالإنجليزية</span><input type="text" dir="ltr" value={nameEn} onChange={(event) => setNameEn(event.target.value)} required minLength={2} maxLength={100} /></label>
        <label className="coverage-field"><span>المدينة</span><input type="text" value={city} onChange={(event) => setCity(event.target.value)} required minLength={2} maxLength={100} /></label>
      </div>
      <div className="coverage-boundary-editor">
        <label className="coverage-field"><span>نقاط حدود النطاق</span>
          <textarea value={points} dir="ltr" rows={7} onChange={(event) => { setPoints(event.target.value); setVerified(false); }} placeholder="خط العرض, خط الطول" aria-describedby={`boundary-hint-${area?.id ?? 'new'}`} />
          <small id={`boundary-hint-${area?.id ?? 'new'}`}>كل نقطة في سطر، بترتيب محيط النطاق. استخدم حدودًا فعلية معتمدة؛ موقع المركز وحده لا يكفي.</small>
        </label>
        <BoundaryPreview points={parsed.error ? [] : parsed.points} />
      </div>
      <div className="coverage-checks">
        <label><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)} />راجعت الحدود وأعتمدها للتحقق من موقع العميل</label>
        <label><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />النطاق مفعّل</label>
      </div>
      {!active ? <p className="coverage-muted">إيقاف النطاق يمنع الحجوزات الجديدة لجميع فلله.</p> : null}
      {error ? <p className="coverage-field-error" role="alert">{error}</p> : null}
      <button type="submit">{busy ? 'جارٍ الحفظ…' : area ? 'حفظ النطاق' : 'إضافة النطاق'}</button>
    </fieldset>
  </form>;
}

function BlockForm({ areaId, block, teams, busy, save }: { areaId: string; block?: CoverageBlock; teams: CoverageSnapshot['teams']; busy: boolean; save: Save }) {
  const [code, setCode] = useState(block?.code ?? '');
  const [nameAr, setNameAr] = useState(block?.name_ar ?? '');
  const [nameEn, setNameEn] = useState(block?.name_en ?? '');
  const [teamId, setTeamId] = useState(block?.team_id ?? teams.find((team) => team.active)?.id ?? '');
  const [active, setActive] = useState(block?.active ?? false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(null);
    if (!/^[A-Z0-9-]{1,12}$/.test(code.trim())) { setError('استخدم حرفًا أو رقمًا لرمز البلوك، مثل A أو B2.'); return; }
    if (!teamId) { setError('حدّد الفريق المسؤول عن البلوك.'); return; }
    const body: CoverageBlockInput = { areaId, code: code.trim(), nameAr: nameAr.trim() || `بلوك ${code.trim()}`, nameEn: nameEn.trim() || `Block ${code.trim()}`, teamId, active };
    const success = await save(() => block ? admin.updateCoverageBlock(block.id, { code: body.code, nameAr: body.nameAr, nameEn: body.nameEn, teamId: body.teamId, active: body.active }) : admin.createCoverageBlock(body), block ? 'حُفظت إعدادات البلوك.' : 'أُضيف البلوك. أضف أرقام الفلل التابعة له.');
    if (success && !block) { setCode(''); setNameAr(''); setNameEn(''); setActive(false); }
  };
  return <form className="coverage-form" onSubmit={(event) => void submit(event)}><fieldset disabled={busy}>
    <div className="coverage-form-grid">
      <label className="coverage-field"><span>رمز البلوك</span><input type="text" dir="ltr" value={code} onChange={(event) => setCode(numerals(event.target.value).toUpperCase())} maxLength={12} required placeholder="B" /></label>
      <label className="coverage-field"><span>الاسم بالعربية</span><input type="text" value={nameAr} onChange={(event) => setNameAr(event.target.value)} maxLength={100} placeholder={code ? `بلوك ${code}` : 'بلوك B'} /></label>
      <label className="coverage-field"><span>الاسم بالإنجليزية</span><input type="text" dir="ltr" value={nameEn} onChange={(event) => setNameEn(event.target.value)} maxLength={100} placeholder={code ? `Block ${code}` : 'Block B'} /></label>
      <label className="coverage-field"><span>الفريق المسؤول</span><select value={teamId} onChange={(event) => setTeamId(event.target.value)} required>
        <option value="">اختر فريقًا</option>{teams.map((team) => <option value={team.id} key={team.id}>{team.name_en || team.name_ar}{team.active ? ' · نشط' : ' · غير نشط'}</option>)}
      </select></label>
    </div>
    <div className="coverage-checks"><label><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />البلوك مفعّل</label></div>
    <p className="coverage-muted">الحجز يتطلب بلوكًا وفريقًا نشطين وفيلا مفعّلة. <Link to="/teams">إدارة الفرق</Link></p>
    {error ? <p className="coverage-field-error" role="alert">{error}</p> : null}
    <button type="submit">{busy ? 'جارٍ الحفظ…' : block ? 'حفظ البلوك' : 'إضافة البلوك'}</button>
  </fieldset></form>;
}

function VillaRegistry({ area, block, teamActive, busy, save }: { area: CoverageArea; block: CoverageBlock; teamActive: boolean; busy: boolean; save: Save }) {
  const [numbers, setNumbers] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const incoming = villaNumbers(numbers);
  const rows = [...block.villas].filter((villa) => villa.villa_number.toUpperCase().includes(numerals(search).trim().toUpperCase())
    && (filter === 'all' || villa.active === (filter === 'active'))).sort((a, b) => a.villa_number.localeCompare(b.villa_number, 'en', { numeric: true }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(null);
    if (!incoming.length) { setError('أدخل رقم فيلا واحدًا على الأقل.'); return; }
    if (incoming.length > 500 || incoming.some((item) => item.length > 24 || !/^[A-Z0-9]+(?:[-/][A-Z0-9]+)*$/.test(item) || !/[0-9]/.test(item))) { setError('استخدم رقم فيلا مثل 101 أو A-101، وبحد أقصى 500 فيلا في كل إضافة.'); return; }
    const registered = area.blocks.flatMap((item) => item.villas);
    const duplicate = incoming.find((item) => registered.some((villa) => villa.villa_number.toUpperCase() === item));
    if (duplicate) { setError(`رقم الفيلا ${duplicate} مسجل مسبقًا في هذا النطاق. عدّل حالته من سجل البلوك.`); return; }
    if (await save(() => admin.addCoverageVillas(block.id, incoming), 'أُضيفت أرقام الفلل إلى البلوك.')) setNumbers('');
  };
  const ready = area.active && area.boundary_verified && block.active && teamActive;
  return <>
    <form className="coverage-villa-add" onSubmit={(event) => void submit(event)}>
      <label className="coverage-field"><span>أرقام الفلل المتاحة</span><textarea dir="ltr" value={numbers} onChange={(event) => setNumbers(event.target.value)} rows={2} placeholder="101, 102, 103" disabled={busy} aria-describedby="villa-entry-hint" />
        <small id="villa-entry-hint">افصل الأرقام بفاصلة أو سطر. نضيف الأرقام المكتوبة فقط، دون افتراض تسلسل.</small></label>
      <div><button disabled={busy || incoming.length === 0} type="submit">{busy ? 'جارٍ الحفظ…' : 'إضافة الفلل'}</button><span className="coverage-muted">عدد الأرقام: {incoming.length}</span></div>
      {error ? <p className="coverage-field-error" role="alert">{error}</p> : null}
    </form>
    {!ready ? <p className="coverage-registry-note">تُحفظ الفلل الآن. يبدأ الحجز بعد اعتماد حدود النطاق وتفعيل النطاق والبلوك والفريق.</p> : null}
    <div className="coverage-registry-tools">
      <label className="coverage-field"><span>البحث برقم الفيلا</span><input type="search" dir="ltr" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="رقم الفيلا" /></label>
      <label className="coverage-field"><span>حالة الرقم</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">كل الفلل</option><option value="active">المفعّلة</option><option value="inactive">الموقوفة</option></select></label>
      <span className="coverage-muted">الأرقام المعروضة: {rows.length} من {block.villas.length}</span>
    </div>
    {!rows.length ? <div className="coverage-empty"><strong>{block.villas.length ? 'لا توجد أرقام مطابقة' : 'سجل الفلل فارغ'}</strong><p>{block.villas.length ? 'جرّب رقمًا آخر أو غيّر حالة العرض.' : 'أضف الفلل التي تستطيع خدمتها في هذا البلوك. لن تُقبل أي فيلا غير مسجلة.'}</p></div>
      : <div className="coverage-villa-list">{rows.map((villa) => <div className="coverage-villa-row" key={villa.id}>
        <div><span className="coverage-muted">فيلا</span><strong dir="ltr">{villa.villa_number}</strong></div>
        <span className="coverage-villa-status">{villa.active ? ready ? 'متاحة للحجز' : 'مفعّلة، بانتظار جاهزية النطاق' : 'موقوفة'}</span>
        <button className="ghost" disabled={busy} aria-label={`${villa.active ? 'إيقاف' : 'تفعيل'} الفيلا ${villa.villa_number}`} onClick={() => void save(() => admin.updateCoverageVilla(villa.id, !villa.active), villa.active ? 'أُوقف رقم الفيلا عن الحجوزات الجديدة.' : 'فُعّل رقم الفيلا.')}>{villa.active ? 'إيقاف' : 'تفعيل'}</button>
      </div>)}</div>}
  </>;
}

function parseBoundary(value: string): { points: CoveragePoint[]; error?: string } {
  if (!value.trim()) return { points: [] };
  const rows = numerals(value).trim().split(/\n+/);
  if (rows.length > 500) return { points: [], error: 'استخدم 500 نقطة حدود كحد أقصى.' };
  const points: CoveragePoint[] = [];
  for (const [index, row] of rows.entries()) {
    const pair = row.trim().split(/[\s,،]+/);
    if (pair.length !== 2 || pair.some((number) => !Number.isFinite(Number(number)))) return { points: [], error: `راجع النقطة ${index + 1}. أدخل خط العرض ثم خط الطول.` };
    const [lat, lng] = pair.map(Number);
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return { points: [], error: `إحداثيات النقطة ${index + 1} خارج المجال المسموح.` };
    points.push({ lat, lng });
  }
  if (points.length && points.length < 3) return { points, error: 'أضف 3 نقاط حدود على الأقل، أو اترك الحدود فارغة لحفظها لاحقًا.' };
  return { points };
}

function BoundaryPreview({ points }: { points: CoveragePoint[] }) {
  if (points.length < 3) return <div className="coverage-boundary-empty"><strong>حدود النطاق</strong><p>تظهر المعاينة بعد إدخال 3 نقاط على الأقل.</p><span>المعاينة للحدود فقط، دون خريطة شوارع.</span></div>;
  const latitudes = points.map((point) => point.lat);
  const longitudes = points.map((point) => point.lng);
  const minLat = Math.min(...latitudes), maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes), maxLng = Math.max(...longitudes);
  const correction = Math.cos((minLat + maxLat) / 2 * Math.PI / 180);
  const width = (maxLng - minLng) * correction, height = maxLat - minLat;
  const scale = 180 / (Math.max(width, height) || 1);
  const projected = points.map((point) => ({ x: 130 + (point.lng - (minLng + maxLng) / 2) * correction * scale, y: 110 - (point.lat - (minLat + maxLat) / 2) * scale }));
  return <figure className="coverage-boundary-preview"><svg viewBox="0 0 260 220" role="img" aria-label="معاينة الشكل الناتج من نقاط حدود النطاق">
    <polygon points={projected.map((point) => `${point.x},${point.y}`).join(' ')} />
    {projected.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3"><title>النقطة {index + 1}</title></circle>)}
  </svg><figcaption>معاينة الحدود · عدد النقاط: {points.length}</figcaption></figure>;
}
