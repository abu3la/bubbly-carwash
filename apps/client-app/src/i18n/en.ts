import type { Copy } from './types';

/**
 * English.
 *
 * Written as product copy rather than a word-for-word translation: Arabic and
 * English carry emphasis differently, and a literal rendering of the Arabic
 * ("Morning of light, Faisal") reads as a machine did it. The intent, the
 * tone and the length budget are matched; the wording is not.
 */
export const en: Copy = {
  brand: {
    name: 'BubblesCarWash',
    latin: 'BubblesCarWash',
    tagline: 'A shine, right on time',
    version: 'BubblesCarWash · Version 1.0 · A shine, right on time',
  },

  common: {
    back: 'Back',
    continue: 'Continue',
    sending: 'Sending…',
    verifying: 'Verifying…',
    cancel: 'Cancel',
    change: 'Change',
    later: 'Later',
    money: (amount) => `SAR ${amount}`,
    fromPrice: (amount) => `From SAR ${amount}`,
    minutes: (count) => `≈ ${count} min`,
    monthly: 'per month',
    totalWithVat: 'Total incl. VAT',
    securePayment: 'Secure payment through a certified gateway — we never store your card.',
  },

  authErrors: {
    wrongCode: 'That code is wrong or has expired. Request a new one.',
    tooManyRequests: 'Too many attempts. Wait a minute and try again.',
    invalidPhone: "That phone number doesn't look right. Check it and try again.",
    offline: 'No internet connection. Check your network.',
    unknown: "That didn't go through. Please try again.",
  },

  addressErrors: {
    outsideServiceArea: 'We only serve Saudi Arabia right now. Pick a location inside the service area.',
    badCoordinates: "We couldn't read that location. Move the map and try again.",
    addressLineRequired: 'Enter a clear address so the technician can find you.',
    unauthorized: 'Your session expired. Please sign in again.',
    offline: 'No internet connection. Check your network.',
    unknown: "We couldn't save that address. Please try again.",
  },

  vehicleErrors: {
    makeRequired: 'Enter the make of the car.',
    modelRequired: 'Enter the model.',
    plateRequired: 'Enter the plate — the technician needs it to find your car.',
    unauthorized: 'Your session expired. Please sign in again.',
    offline: 'No internet connection. Check your network.',
    unknown: "We couldn't save the car. Please try again.",
  },

  vehicleSizes: ['Sedan', 'SUV', 'Pickup'],

  tabs: { home: 'Home', bookings: 'Bookings', profile: 'Account' },

  onboarding: {
    blurb: 'A hand wash at your door — book a slot and follow every step until your car shines.',
    start: 'Get started',
    skip: 'Skip for now',
    languageArabic: 'العربية',
    languageEnglish: 'English',

    signInTitle: 'Sign in',
    phoneTitle: 'Sign in with your mobile number',
    phoneSub: 'We use your mobile number to verify your identity.',
    phonePlaceholder: '5X XXX XXXX',
    sendCode: 'Send code',
    terms: 'By continuing you agree to the Terms and Privacy Policy.',

    otpTitle: 'Verification',
    otpHeading: 'Enter your code',
    otpSentTo: 'Verification code for',
    developmentCodeHint: (code) => `Current development code: ${code}`,
    resendIn: (time) => `Resend in ${time}`,
    resendNow: 'You can request a new code now',
    resend: 'Resend code',
    verify: 'Verify',

    locationTitle: 'Where’s your car?',
    locationBlurb:
      'We use your location to show the prices and slots that are actually available near you — before you commit to anything.',
    allowLocation: 'Allow location',
    enterManually: 'Enter address manually',

    searchPlaceholder: 'Search for a district or street…',
    mapNote: 'Location map',
    servedHere: 'We serve this area',
    checkingArea: 'Checking…',
    outsideArea: 'Outside service area',
    areaCheckFailed: 'Check unavailable',
    droppedPin: 'Dropped pin',
    confirmLocation: 'Confirm location',
    useCurrentLocation: 'Use my current location',
    currentLocationUnavailable: 'We could not access your current location. Check location permission and try again.',

    addressTitle: 'Save address',
    addressHeading: 'Save your address',
    addressLabelSection: 'Label',
    addressManualSub: 'Write your address clearly so the technician can find you.',
    addressLinePlaceholder: 'e.g. Villa 12, Al Yasmin Street, Al Nakheel',
    addressLabels: ['Home', 'Work', 'Other'],
    accessNotes: 'Access notes (optional)',
    accessNotesPlaceholder: 'Blue gate, next to the mosque',
    saveAndContinue: 'Save and continue',
    saveLocation: 'Save location',
    vehicleTitle: 'Your car',
    vehicleHeading: 'Register your car',
    vehicleSub: 'So the technician recognises it when they arrive.',
    vehicleMake: 'Make — e.g. Lexus',
    vehicleModel: 'Model — e.g. LX 600',
    vehicleColour: 'Colour — e.g. white',
    vehiclePlate: 'Plate number',
    vehicleSizeSection: 'Body type',
  },

  home: {
    greeting: (name) => `Good morning, ${name}`,
    bookWash: 'Book a wash',
    chooseWhatSuits: 'Pick what suits you',
    singleWash: 'Single wash',
    singleWashSub: 'Fastest — one slot, one wash',
    packages: 'Prepaid packages',
    packagesTeaser: (save) => `Save up to ${save} — wash credits valid for 90 days`,
    packagesBalance: (credits, total, expiry) =>
      `${credits} of ${total} washes left · expires ${expiry}`,
    creditsLeft: (credits) => `${credits} left`,
    club: 'Bubbles Club',
    clubTeaser: 'Two monthly plans: two or three washes',
    clubActive: (plan, renews) => `${plan} · renews ${renews}`,
    clubBalance: (plan, credits, leftThisWeek) =>
      `${plan} · ${credits} washes available · ${leftThisWeek} this week`,
    join: 'Join',
    myClub: 'My club',
    promises: {
      onTime: 'Always on time',
      documented: 'Before-and-after photos or 360° video',
      support: 'Fast support',
    },
  },

  booking: {
    chooseService: 'Choose a service',
    vehicleAndPlace: 'Car and location',
    slot: 'Slot',
    review: 'Review',
    payment: 'Payment',

    whatsIncluded: 'What’s included',
    continueBooking: 'Continue booking',

    vehicleSection: 'Car',
    addVehicle: 'Add another car',
    selected: 'Selected',
    plateLabel: 'Plate',
    defaultVehicle: 'Default car',
    locationSection: 'Location',

    day: 'Day',
    availableSlots: 'Available slots',
    takenNote: 'Faded slots are already taken.',
    takenNoteMember: 'Faded slots are booked · the peak slot is open to you as a member.',
    prioritySlot: 'Priority',
    holdNote: 'We hold your slot while you pay.',
    periods: { morning: 'Morning', afternoon: 'Afternoon', night: 'Night' },
    fridayOff: 'Teams are off on Friday',
    checkingAvailability: 'Checking the nearest team…',
    teamAvailable: (team, distanceKm, capacity) =>
      `${team} covers your location · ${distanceKm} km away · ${capacity} bookings a day`,
    outsideTeamArea: 'Your location is outside the active team’s area right now.',
    dayFull: 'The team is full for this day. Pick another day.',
    remainingSlots: (count) => `${count} left`,

    addOnsSection: 'Optional extras',
    addOnWithPrice: (label, price) => `${label} (+${price})`,
    useCredit: 'Use a package credit',
    useCreditSub: (credits) => `You have ${credits} washes — one will be used`,
    creditCoversWashOnly: 'A credit covers the wash only — extras are paid separately.',
    fromPackage: (service) => `${service} — from your package`,
    fromClub: (service) => `${service} — from your membership`,
    oneWash: '1 wash',

    paySourceSection: 'How you are paying',
    sourceClub: 'Use a club wash',
    sourcePackage: 'Use a package credit',
    sourceCash: 'Pay now',
    cashNote: 'The wash and any extras are paid at booking.',
    clubRemaining: (weekly, leftThisWeek) =>
      `${leftThisWeek} of ${weekly} washes remain this week`,
    confirmBooking: 'Confirm booking',
    continueToPayment: 'Continue to payment',

    choosePayment: 'Choose a payment method',
    payAmount: (amount) => `Pay ${amount}`,

    processingPayment: 'Processing your payment…',
    processingPaymentSub: 'Don’t close the app — you won’t be charged twice.',
    paymentFailed: 'Payment was not completed. The booking was not confirmed and you can try again.',
    processingCredit: 'Confirming your booking…',
    processingCreditSub: 'Adding this appointment to your weekly washes.',

    paidTitle: 'Paid — your booking is confirmed',
    creditTitle: 'Booked — one wash used from your balance',
    successSub: 'We’ll notify you when a technician is assigned and before they arrive.',
    trackWash: 'Track the wash',
    backHome: 'Back to home',
  },

  packages: {
    title: 'Prepaid packages',
    blurb: 'Prepaid wash credits — a lower price per wash, valid for 90 days.',
    washes: 'washes',
    perWash: (per) => `SAR ${per} per wash ·`,
    saveLabel: 'save',
    bestValue: 'Best value',
    detailTitle: (washes) => `${washes}-wash package`,
    exteriorWashes: (washes) => `${washes} exterior washes`,
    savingLine: (per) => `SAR ${per} per wash — save`,
    rulesSection: 'Package rules',
    rules: [
      'Valid for 90 days from purchase',
      'Covers the full exterior wash',
      'For one car registered to your account',
      'Extras are paid separately at booking',
      'Credit is returned if you cancel 12 hours before the slot',
    ],
    buy: (amount) => `Buy package — ${amount}`,
    lineItem: (washes) => `${washes}-wash package`,
    creditNote: 'Credits are added as soon as payment is confirmed.',
    processing: 'Processing your payment…',
    processingSub: 'Don’t close the app — you won’t be charged twice.',
    doneTitle: (washes) => `${washes} washes added to your balance`,
    doneSub: (expiry) => `Valid until ${expiry} — one credit is used per confirmed booking.`,
    bookNow: 'Book now',
  },

  club: {
    title: 'Bubbles Club',
    blurb: 'A monthly membership — washes scheduled automatically, and priority on slots.',
    planLine: (credits, weekly) =>
      `${credits} washes a month · up to ${weekly} a week`,
    mostPopular: 'Most popular',
    perksSection: 'What you get',
    perks: [
      'Washes scheduled automatically in your preferred slot',
      'Pick a morning, afternoon or night slot',
      'Before-and-after vehicle documentation',
      'Pause or cancel any time',
    ],

    reviewTitle: 'Confirm membership',
    paymentSection: 'Payment method',
    monthlyFee: 'Monthly membership',
    firstRenewal: 'First renewal',
    consent: (amount) => `I agree to automatic renewal at ${amount} a month until I cancel.`,
    activate: 'Activate membership',

    processing: 'Activating your membership…',
    processingSub: 'Confirming the recurring payment mandate with your bank.',

    member: 'Member',
    renewsLine: (renews, amount) => `Renews ${renews} · ${amount} a month`,
    creditsAvailable: (credits) => `${credits} washes available`,
    usageThisWeek: 'This week’s usage',
    usageOf: (used, total) => `${used} of ${total}`,
    cycleCredits: 'Credits this cycle',
    washesCount: (count) => `${count} washes`,
    rolledOver: 'Rolled over',
    preferredSlot: 'Preferred slot',
    preferredSlotValue: 'Tuesday 10:00',
    bookFromClub: 'Book a wash from your membership',
    pause: 'Pause',
    paused: 'Your membership is paused until the next cycle.',
    cancelSubscription: 'Cancel membership',
    cancelTitle: 'Cancel membership?',
    cancelBody: (credits, renews) =>
      `You’ll keep ${credits} washes until ${renews}, and it won’t renew after that.`,
    keep: 'Keep it',
    confirmCancel: 'Confirm cancellation',
    cancelled: 'Automatic renewal cancelled.',
  },

  bookings: {
    title: 'Bookings',
    tabUpcoming: 'Upcoming',
    tabActive: 'Active',
    tabPast: 'Past',

    emptyUpcoming: 'No upcoming bookings yet',
    emptyActive: 'No wash in progress',

    vehicleLabel: 'Car',
    locationLabel: 'Location',
    paymentLabel: 'Payment',
    packageCredit: 'Package credit',
    clubWash: 'Club membership',
    reschedule: 'Reschedule',
    rescheduleSoon: 'We’ll open available slots shortly.',
    cancelBooking: 'Cancel booking',
    cancelled: 'Booking cancelled, and any credit returned.',
    freeCancelNote: 'Free to cancel up to 12 hours before the slot.',

    onTheWay: 'On the way',
    onSite: 'On site',
    arrivingIn: 'Arriving in about 12 minutes',
    started: 'Started work on your car',
    washStatus: 'Wash status',
    waiting: 'Waiting…',
    simulateNext: 'Simulate next step',
    replay: 'Replay',

    documentation: 'Before-and-after documentation',
    documentationNote: (technician) =>
      `Photos or 360° video captured by ${technician} before and after the wash — view only.`,

    rateTechnician: (technician) => `Rate ${technician}`,
    commentPlaceholder: 'Add a comment (optional)…',
    attachPhotos: 'Attach the technician’s photos',
    submitRating: 'Submit rating',
    ratingStars: (value) => `${value} out of 5`,
    thanksTitle: 'Thank you!',
    thanksBody: 'Your rating is in and the quality team will review it.',
    ratingSent: 'Thanks — your rating is in.',
  },

  profile: {
    verified: 'Verified',
    walletBalance: 'Package balance',
    ofTotal: (total) => `of ${total}`,
    expires: (date) => `Expires ${date}`,
    clubCredits: 'washes',
    renews: (date) => `Renews ${date}`,
    noBalanceTitle: 'No balance yet',
    noBalanceSub: (amount) => `Buy a package and save up to 18% — from ${amount}.`,

    rows: {
      vehicles: 'My cars',
      addresses: 'My addresses',
      cards: 'Payment cards',
      invoices: 'Receipts and invoices',
      language: 'Language',
      notifications: 'Notifications',
      support: 'Help and support',
      terms: 'Terms and privacy',
    },
    addressesValue: 'Home · Work',
    cardValue: 'mada •••• 6011',
    notificationsOn: 'On',
    languageName: 'English',

    signOut: 'Sign out',
    signedOut: 'You’ve been signed out.',
  },

  services: {
    exterior: {
      name: 'Single wash',
      blurb: 'An exterior wash at your car, documented before and after.',
      includes: [
        'Active foam and a full body rinse',
        'Wheels and tyres cleaned',
        'Dried with microfibre towels',
        'Exterior glass polished',
      ],
    },
    full: {
      name: 'Full interior and exterior wash',
      blurb: 'Everything in the exterior wash, plus the cabin and a polished dashboard.',
      includes: [
        'Everything in the exterior wash',
        'Cabin and seats vacuumed',
        'Dashboard and console wiped',
        'Interior glass polished',
      ],
    },
  },

  addOns: { wax: 'Protective wax layer', tires: 'Tyre shine' },
  plans: { basic: 'Basic', 'basic-3': 'Basic', plus: 'Super Wash', 'plus-3': 'Super Wash' },
  packageLabel: { 3: '3-wash package', 5: '5-wash package', 10: '10-wash package' },

  beats: {
    arrived: { title: 'Arrived', copy: 'The technician is at your gate.' },
    washed: { title: 'Washed', copy: 'Wash complete — drying now.' },
    verified: { title: 'Verified', copy: 'Quality checked — before-and-after evidence is ready.' },
  },

  technicianName: 'Mohammed A.',
  customerName: 'Faisal Alotaibi',
  customerShort: 'Faisal',
  customerInitial: 'F',
  vehicleName: 'Lexus LX — White',
  addressLabel: 'Home',
  addressLine: 'Home 12, Ibrahim Al Juffali Street',
  addressDistrict: 'Al Awali, Makkah',
  addressFull: 'Home 12, Ibrahim Al Juffali Street, Al Awali, Makkah',
  addressShort: 'Al Awali',
  days: ['Today, Monday', 'Tomorrow, Tuesday', 'Wednesday 12', 'Thursday 13'],
  pastServices: {
    'BK-4821': 'Exterior wash',
    'BK-4770': 'Exterior wash + wax',
  },
  pastDates: {
    'BK-4821': 'Sunday 2 August',
    'BK-4770': 'Thursday 23 July',
  },
  payMethods: {
    mada: { label: 'mada', detail: '•••• 6011' },
    visa: { label: 'Visa', detail: '•••• 4242' },
    apple: { label: 'Apple Pay', detail: 'Pay with a touch' },
  },
  renewalDate: '10 September',
  packageExpiry: '8 November 2026',
};
