export const strings = {
  ar: {
    dir: "rtl",
    seo: {
      title: "BubblesCarWash | غسيل سيارات متنقل داخل قرية الشربتلي",
      description: "احجز غسيل سيارتك في موقعها داخل قرية الشربتلي بحي المروة، جدة. اختر السيارة والموعد، وتابع توثيق الغسلة قبلها وبعدها."
    },
    nav: { service: "الخدمة", how: "طريقة الحجز", packages: "الباقات", coverage: "نطاق التغطية", support: "الدعم", switchLabel: "English", switchAria: "Switch to English", book: "اشترك الآن", menu: "القائمة", close: "إغلاق" },
    hero: {
      brand: "BubblesCarWash", tagline: "لمعة في وقتها", carwash: "CarWash",
      title: "غسيل سيارتك عند موقعها.",
      desc: "حدد سيارتك وموقعك وموعدك. يصل الفريق إلى موقعك ويوثّق الغسلة قبلها وبعدها.",
      coverage: "نخدم حاليًا داخل قرية الشربتلي في حي المروة، جدة.",
      cta: "اشترك الآن", ctaCoverage: "تحقق من رقم فيلتك",
      artAlt: "مخطط توضيحي لقرية الشربتلي: مسار الفريق من البوابة إلى سيارتك داخل الكمباوند.",
      artZone: "قرية الشربتلي", artOutside: "خارج نطاق الخدمة", artGate: "البوابة", artCar: "سيارتك", artRoute: "مسار الفريق", artZoneNote: "حدود الخدمة = حدود الكمباوند"
    },
    journey: {
      label: "طريقة الحجز", title: "من موقعك إلى اللمعة",
      steps: [
        { title: "اختر سيارتك", text: "سياراتك محفوظة في حسابك. اختر واحدة أو أضف سيارة جديدة." },
        { title: "حدد الموقع والموعد", text: "عنوانك المحفوظ أو موقعك الحالي، ثم موعد صباحي أو ظهري أو مسائي." },
        { title: "يصل الفريق", text: "يُسند الحجز إلى فريق مناسب، ويصل إلى السيارة في موقعها." },
        { title: "راجع التوثيق", text: "صور أو فيديو لحالة السيارة قبل الغسيل وبعده، في حسابك." }
      ]
    },
    trust: {
      label: "الثقة والتوثيق", title: "كل غسلة واضحة من البداية للنهاية",
      copy: "نعرض المواعيد المتاحة حسب موقعك، ويوثّق الفريق حالة السيارة قبل الغسيل وبعده.",
      before: "قبل الغسيل", after: "بعد الغسيل", beforeSlot: "صورة سيارتك قبل الغسيل", afterSlot: "صورة سيارتك بعد الغسيل",
      appTitle: "غسلة اليوم", appSlot: "10:30–11:00", appMeta: "غسلة مفردة · فيلا 112", appStatus: "حالة الغسلة", appWaiting: "بالانتظار…", photoBefore: "توثيق قبل الغسيل", photoAfter: "توثيق بعد الغسيل",
      appSteps: [{ key: "arrived", title: "وصل", copy: "الفريق عند سيارتك.", time: "10:31" }, { key: "washed", title: "الغسيل", copy: "انتهى الغسيل، والتجفيف الآن.", time: "10:52" }, { key: "verified", title: "تأكد", copy: "تمت مراجعة الجودة وإرسال الصور.", time: "10:58" }],
      framesNote: "لقطات من متتبع الغسلة في تطبيق العميل. يرفع الفريق صور سيارتك قبل الغسيل وبعده إلى حسابك.",
      facts: [
        { k: "المواعيد", v: "فترات صباحية وظهرية ومسائية، حسب موقعك وسعة الفريق. لا توجد مواعيد يوم الجمعة." },
        { k: "التوثيق", v: "صور أو فيديو لحالة السيارة قبل الغسيل وبعده، محفوظة مع الحجز." },
        { k: "الدفع", v: "دفع إلكتروني آمن عبر ميسر." },
        { k: "الحساب", v: "تسجيل الدخول برقم الجوال، مع حفظ سياراتك وعناوينك." }
      ]
    },
    packages: {
      label: "الخدمات والباقات", title: "غسلة عند الحاجة، أو باقة لأسبوعك",
      colPlan: "الخيار", colFreq: "الغسلات", colPrice: "السعر",
      single: "غسلة مفردة", once: "لمرة واحدة", perMonth: "شهريًا",
      noRollover: "الغسلات الأسبوعية غير المستخدمة لا تتحول إلى رصيد متراكم.",
      loading: "نحمّل الباقات...", error: "تعذّر تحميل الباقات. حاول مرة أخرى.", retry: "أعد المحاولة",
      cta: "اشترك الآن", ctaHint: "الاشتراك يبدأ بالتحقق من رقم فيلتك."
    },
    coverage: {
      label: "نطاق التغطية", title: "خدمتنا متاحة حاليًا داخل قرية الشربتلي",
      copy: "أدخل رقم فيلتك لنتحقق من وجودها داخل نطاق الخدمة ونعرض المواعيد المتاحة.",
      inputLabel: "رقم الفيلا", inputHint: "الرقم كما يظهر على بوابة الفيلا داخل قرية الشربتلي.", check: "تحقق", checking: "نتحقق من رقم الفيلا...", villaPrefix: "فيلا",
      states: { inside: "فيلتك داخل نطاق الخدمة.", outside: "موقعك خارج نطاق الخدمة الحالي.", unserved: "لا نخدم هذا الرقم حاليًا. تأكد من رقم الفيلا داخل قرية الشربتلي.", error: "تعذّر التحقق من رقم الفيلا. حاول مرة أخرى." },
      slotsTitle: "المواعيد المتاحة", slotsNone: "لا توجد مواعيد متاحة. جرّب تاريخًا آخر.", slotsDate: "الأحد 6 سبتمبر",
      periods: [{ name: "صباحًا", range: "8:00–11:00" }, { name: "ظهرًا", range: "12:00–15:00" }, { name: "مساءً", range: "16:00–19:00" }],
      slotsAvail: "متاح", slotsFull: "مكتمل",
      outsideNote: "نتحقق من رقم الفيلا مقابل سجل فلل قرية الشربتلي، لا من اسم الحي.",
      demoNote: "أمثلة للتجربة", subscribe: "اشترك الآن", subscribeNote: "يرتبط هذا الزر بصفحة الاشتراك في التطبيق قبل الإطلاق."
    },
    coming: {
      label: "القادم", title: "قريبًا في BubblesCarWash",
      intro: "نعمل على هذه المزايا الآن. لا تُعرض هنا إلا ما هو مخطط فعلًا.",
      items: [
        "باقة شهرية مستقلة لكل سيارة، وشراء باقات لعدة سيارات في دفعة واحدة.",
        "جدول وعنوان مستقل لكل سيارة.",
        "التجديد التلقائي للباقات، مع إمكانية إلغاء تجديد سيارة محددة واستمرار الدورة المدفوعة حتى نهايتها.",
        "شراء الباقات من الموقع أو التطبيق بالحساب نفسه.",
        "بطاقة توضح الغسلة القادمة، ومتابعة مراحل الغسلة بعد بدء الفريق.",
        "تجربة أسرع للعميل العائد دون إعادة إدخال السيارة والعنوان.",
        "نشر التطبيق في App Store وGoogle Play.",
        "رسائل نصية للحجز عبر مزود رسائل."
      ],
      expand: "نعمل على توسيع نطاق الخدمة تدريجيًا.", appSoon: "التطبيق قريبًا"
    },
    footer: {
      coverage: "نخدم حاليًا داخل قرية الشربتلي في حي المروة، جدة.",
      support: "الدعم", privacy: "سياسة الخصوصية", terms: "الشروط والأحكام", deleteAccount: "حذف الحساب",
      lang: "اللغة"
    }
  },
  en: {
    dir: "ltr",
    seo: {
      title: "BubblesCarWash | Mobile Car Wash in Sharbatly Village",
      description: "Book a mobile car wash at your location within Sharbatly Village Compound in Al Marwah, Jeddah. Choose your vehicle and time, with before and after wash documentation."
    },
    nav: { service: "Service", how: "How it works", packages: "Packages", coverage: "Coverage", support: "Support", switchLabel: "العربية", switchAria: "التبديل إلى العربية", book: "Subscribe", menu: "Menu", close: "Close" },
    hero: {
      brand: "BubblesCarWash", tagline: "Shine, right on time.", carwash: "CarWash",
      title: "A clean car, right where you parked it.",
      desc: "Choose your car, location, and time. Our team comes to you and documents the wash before and after.",
      coverage: "Currently serving Sharbatly Village Compound in Al Marwah, Jeddah.",
      cta: "Subscribe", ctaCoverage: "Check your villa number",
      artAlt: "Schematic plan of Sharbatly Village: the team's route from the gate to your car inside the compound.",
      artZone: "Sharbatly Village", artOutside: "Outside service area", artGate: "Gate", artCar: "Your car", artRoute: "Team route", artZoneNote: "Service boundary = compound boundary"
    },
    journey: {
      label: "How it works", title: "From your location to a clean finish",
      steps: [
        { title: "Choose your vehicle", text: "Your cars are saved to your account. Pick one or add a new one." },
        { title: "Set the location and time", text: "A saved address or your current location, then a morning, midday, or evening slot." },
        { title: "Our team arrives", text: "Your booking goes to the right team, and they come to the car where it's parked." },
        { title: "Review the wash record", text: "Photos or video of the car before and after the wash, kept in your account." }
      ]
    },
    trust: {
      label: "Trust & documentation", title: "Every wash, clear from start to finish",
      copy: "Available times reflect your location and team capacity. Your vehicle is documented before and after every wash.",
      before: "Before the wash", after: "After the wash", beforeSlot: "Photo of your car before the wash", afterSlot: "Photo of your car after the wash",
      appTitle: "Today's wash", appSlot: "10:30–11:00", appMeta: "Single wash · Villa 112", appStatus: "Wash status", appWaiting: "Waiting…", photoBefore: "Before-wash record", photoAfter: "After-wash record",
      appSteps: [{ key: "arrived", title: "Arrived", copy: "Your team is at your car.", time: "10:31" }, { key: "washed", title: "Washed", copy: "Washed. Drying now.", time: "10:52" }, { key: "verified", title: "Verified", copy: "Quality checked — photos sent to you.", time: "10:58" }],
      framesNote: "Screens from the wash tracker in the customer app. The team uploads photos of your car before and after the wash to your account.",
      facts: [
        { k: "Time slots", v: "Morning, midday, and evening windows, based on your location and team capacity. No slots on Fridays." },
        { k: "Documentation", v: "Photos or video of the car before and after the wash, saved with the booking." },
        { k: "Payment", v: "Secure online payment through Moyasar." },
        { k: "Account", v: "Sign in with your phone number; your cars and addresses stay saved." }
      ]
    },
    packages: {
      label: "Services & packages", title: "Wash when you need it, or choose a weekly package",
      colPlan: "Option", colFreq: "Washes", colPrice: "Price",
      single: "Single wash", once: "one time", perMonth: "per month",
      noRollover: "Unused weekly washes don't carry over to the next week.",
      loading: "Loading packages...", error: "We couldn't load the packages. Try again.", retry: "Try again",
      cta: "Subscribe", ctaHint: "Subscribing starts with a villa-number check."
    },
    coverage: {
      label: "Coverage", title: "Currently available in Sharbatly Village",
      copy: "Enter your villa number to confirm it is within our service area and view available time slots.",
      inputLabel: "Villa number", inputHint: "As shown on your villa gate inside Sharbatly Village.", check: "Check", checking: "Verifying the villa number...", villaPrefix: "Villa",
      states: { inside: "Your villa is within our service area.", outside: "Your location is outside our current service area.", unserved: "We don't serve this number yet. Check the villa number inside Sharbatly Village.", error: "We couldn't verify the villa number. Try again." },
      slotsTitle: "Available times", slotsNone: "No appointments are available. Try another date.", slotsDate: "Sunday, 6 September",
      periods: [{ name: "Morning", range: "8:00–11:00" }, { name: "Midday", range: "12:00–15:00" }, { name: "Evening", range: "16:00–19:00" }],
      slotsAvail: "Available", slotsFull: "Full",
      outsideNote: "We check the villa number against the Sharbatly Village registry, not the district name.",
      demoNote: "Try an example", subscribe: "Subscribe", subscribeNote: "This button connects to the app subscription page before launch."
    },
    coming: {
      label: "Next", title: "Coming to BubblesCarWash",
      intro: "We're building these now. Only what's actually planned is listed here.",
      items: [
        "A separate monthly package per car, and buying packages for several cars in one checkout.",
        "An independent schedule and address for each car.",
        "Auto-renewal, with the option to stop renewing one car while its paid cycle runs to the end.",
        "Buying packages on the website or in the app with the same account.",
        "A next-wash card and live wash progress once the team starts.",
        "A faster return visit without re-entering your car and address.",
        "The app on the App Store and Google Play.",
        "Booking text messages through an SMS provider."
      ],
      expand: "We're working to expand our service area gradually.", appSoon: "App coming soon"
    },
    footer: {
      coverage: "Currently serving Sharbatly Village Compound in Al Marwah, Jeddah.",
      support: "Support", privacy: "Privacy Policy", terms: "Terms and Conditions", deleteAccount: "Delete Account",
      lang: "Language"
    }
  }
};
