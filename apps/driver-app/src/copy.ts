/**
 * Arabic only. Every technician Sama employs reads Arabic, and a language
 * toggle in a tool used one-handed beside a car is a setting nobody wants.
 */
export const copy = {
  brand: 'سما',
  role: 'تطبيق الفنّي',

  signInTitle: 'سجّل دخولك',
  signInSub: 'برقم الجوال المسجّل لدى الإدارة.',
  phonePlaceholder: '5X XXX XXXX',
  sendCode: 'إرسال الرمز',
  sending: 'جارٍ الإرسال…',
  codeSentTo: 'أرسلنا الرمز إلى',
  verify: 'دخول',
  verifying: 'جارٍ التحقق…',
  changeNumber: 'تغيير الرقم',

  today: 'مهامك',
  noJobs: 'لا مهام الآن.',
  noJobsSub: 'ستظهر هنا فور إسنادها إليك.',
  history: 'المنجزة',
  noHistory: 'لم تُنجز مهام بعد.',
  signOut: 'تسجيل الخروج',

  vehicle: 'السيارة',
  address: 'الموقع',
  accessNotes: 'ملاحظات الوصول',
  extras: 'إضافات',
  noExtras: 'لا إضافات',

  stages: {
    booked: 'لم يبدأ',
    arrived: 'وصلت',
    washed: 'اكتمل الغسيل',
    verified: 'تم التأكد',
  } as Record<string, string>,

  actions: {
    arrived: 'وصلت الموقع',
    washed: 'انتهيت من الغسيل',
    verified: 'تأكدت من الجودة',
  } as Record<string, string>,

  done: 'اكتملت المهمة',
  working: 'جارٍ الحفظ…',

  services: { exterior: 'غسلة خارجية', full: 'غسلة كاملة' } as Record<string, string>,
  addOns: { wax: 'واكس حماية', tires: 'لمعة إطارات' } as Record<string, string>,
  sizes: { sedan: 'سيدان', suv: 'دفع رباعي', pickup: 'ونيت' } as Record<string, string>,

  errors: {
    wrongCode: 'الرمز غير صحيح أو انتهت صلاحيته.',
    tooManyRequests: 'محاولات كثيرة. انتظر دقيقة.',
    invalidPhone: 'رقم الجوال غير صحيح.',
    notATechnician: 'هذا الحساب ليس حساب فنّي. راجع الإدارة.',
    skippedStage: 'أكمل المرحلة السابقة أولًا.',
    alreadyPast: 'سُجّلت هذه المرحلة من قبل.',
    cancelled: 'أُلغي هذا الحجز.',
    notFound: 'المهمة غير موجودة.',
    offline: 'لا يوجد اتصال. تحقق من الشبكة.',
    unknown: 'تعذّر إكمال العملية.',
  } as Record<string, string>,
};
