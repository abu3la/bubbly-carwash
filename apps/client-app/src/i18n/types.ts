import type { AddOn, Package, Plan, Service } from '../content';
import type { BeatKey } from '@sama/design-tokens';

/**
 * Every piece of copy the app can show, in one shape.
 *
 * Both catalogues implement this interface, so a string added to one and
 * forgotten in the other is a type error rather than a blank label in
 * production. Interpolated lines are functions, not template fragments, so a
 * translator can put the value wherever the sentence needs it — word order is
 * not the same in both languages, and stitching strings together in screen
 * code would force it to be.
 */
export interface Copy {
  brand: {
    name: string;
    latin: string;
    tagline: string;
    version: string;
  };

  common: {
    back: string;
    continue: string;
    /** Shown on a button while a request is in flight. */
    sending: string;
    verifying: string;
    cancel: string;
    change: string;
    later: string;
    /** Formats an amount with the currency in the right position. */
    money: (amount: number) => string;
    /** e.g. "from 49 SAR" / "من ٤٩ ر.س" */
    fromPrice: (amount: number) => string;
    minutes: (count: number) => string;
    monthly: string;
    totalWithVat: string;
    securePayment: string;
  };

  /** Sign-in failures, worded for the customer — never the server's English. */
  authErrors: {
    wrongCode: string;
    tooManyRequests: string;
    invalidPhone: string;
    offline: string;
    unknown: string;
  };

  /** Failures while saving the address, worded for the customer. */
  addressErrors: {
    outsideServiceArea: string;
    badCoordinates: string;
    addressLineRequired: string;
    unauthorized: string;
    offline: string;
    unknown: string;
  };

  /** Failures while registering the car. */
  vehicleErrors: {
    makeRequired: string;
    modelRequired: string;
    plateRequired: string;
    unauthorized: string;
    offline: string;
    unknown: string;
  };

  /** Body types, in the order the API expects: sedan, suv, pickup. */
  vehicleSizes: readonly [string, string, string];

  tabs: {
    home: string;
    bookings: string;
    profile: string;
  };

  onboarding: {
    blurb: string;
    start: string;
    skip: string;
    languageArabic: string;
    languageEnglish: string;

    signInTitle: string;
    phoneTitle: string;
    phoneSub: string;
    phonePlaceholder: string;
    sendCode: string;
    terms: string;

    otpTitle: string;
    otpHeading: string;
    otpSentTo: string;
    resendIn: (time: string) => string;
    resendNow: string;
    resend: string;
    verify: string;

    locationTitle: string;
    locationBlurb: string;
    allowLocation: string;
    enterManually: string;

    searchPlaceholder: string;
    mapNote: string;
    servedHere: string;
    droppedPin: string;
    confirmLocation: string;

    addressTitle: string;
    addressHeading: string;
    addressLabelSection: string;
    addressManualSub: string;
    addressLinePlaceholder: string;
    addressLabels: string[];
    accessNotes: string;
    accessNotesPlaceholder: string;
    saveAndContinue: string;
    vehicleTitle: string;
    vehicleHeading: string;
    vehicleSub: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleColour: string;
    vehiclePlate: string;
    vehicleSizeSection: string;
  };

  home: {
    greeting: (name: string) => string;
    bookWash: string;
    chooseWhatSuits: string;
    singleWash: string;
    singleWashSub: string;
    packages: string;
    packagesTeaser: (save: string) => string;
    packagesBalance: (credits: number, total: number, expiry: string) => string;
    creditsLeft: (credits: number) => string;
    club: string;
    clubTeaser: string;
    clubActive: (plan: string, renews: string) => string;
    /** A member's card leads with what they can still use, not the renewal date. */
    clubBalance: (plan: string, credits: number, leftThisWeek: number) => string;
    join: string;
    myClub: string;
    promises: { onTime: string; documented: string; support: string };
  };

  booking: {
    chooseService: string;
    vehicleAndPlace: string;
    slot: string;
    review: string;
    payment: string;

    whatsIncluded: string;
    continueBooking: string;

    vehicleSection: string;
    addVehicle: string;
    selected: string;
    plateLabel: string;
    defaultVehicle: string;
    locationSection: string;

    day: string;
    availableSlots: string;
    takenNote: string;
    /** Shown to members, for whom the peak slots are not simply unavailable. */
    takenNoteMember: string;
    prioritySlot: string;
    holdNote: string;

    addOnsSection: string;
    addOnWithPrice: (label: string, price: string) => string;
    useCredit: string;
    useCreditSub: (credits: number) => string;
    creditCoversWashOnly: string;
    fromPackage: (service: string) => string;
    fromClub: (service: string) => string;
    oneWash: string;

    /** Heading over the list of balances that could pay for the wash. */
    paySourceSection: string;
    sourceClub: string;
    sourcePackage: string;
    sourceCash: string;
    cashNote: string;
    /** Cycle balance left, and how many more the week's ceiling allows. */
    clubRemaining: (credits: number, leftThisWeek: number) => string;
    confirmBooking: string;
    continueToPayment: string;

    choosePayment: string;
    payAmount: (amount: string) => string;

    processingPayment: string;
    processingPaymentSub: string;
    processingCredit: string;
    processingCreditSub: string;

    paidTitle: string;
    creditTitle: string;
    successSub: string;
    trackWash: string;
    backHome: string;
  };

  packages: {
    title: string;
    blurb: string;
    washes: string;
    /** The price half of a package row — the saving figure is rendered beside it in `Num`. */
    perWash: (per: number) => string;
    /** Precedes the saving figure. Kept apart from it so the number can live in `Num`. */
    saveLabel: string;
    bestValue: string;
    detailTitle: (washes: number) => string;
    exteriorWashes: (washes: number) => string;
    savingLine: (per: number) => string;
    rulesSection: string;
    rules: string[];
    buy: (amount: string) => string;
    lineItem: (washes: number) => string;
    creditNote: string;
    processing: string;
    processingSub: string;
    doneTitle: (washes: number) => string;
    doneSub: (expiry: string) => string;
    bookNow: string;
  };

  club: {
    title: string;
    blurb: string;
    planLine: (credits: number, weekly: number, roll: number) => string;
    mostPopular: string;
    perksSection: string;
    perks: string[];

    reviewTitle: string;
    paymentSection: string;
    monthlyFee: string;
    firstRenewal: string;
    consent: (amount: string) => string;
    activate: string;

    processing: string;
    processingSub: string;

    member: string;
    renewsLine: (renews: string, amount: string) => string;
    creditsAvailable: (credits: number) => string;
    usageThisWeek: string;
    usageOf: (used: number, total: number) => string;
    cycleCredits: string;
    washesCount: (count: number) => string;
    rolledOver: string;
    preferredSlot: string;
    preferredSlotValue: string;
    bookFromClub: string;
    pause: string;
    paused: string;
    cancelSubscription: string;
    cancelTitle: string;
    cancelBody: (credits: number, renews: string) => string;
    keep: string;
    confirmCancel: string;
    cancelled: string;
  };

  bookings: {
    title: string;
    tabUpcoming: string;
    tabActive: string;
    tabPast: string;

    emptyUpcoming: string;
    emptyActive: string;

    vehicleLabel: string;
    locationLabel: string;
    paymentLabel: string;
    packageCredit: string;
    clubWash: string;
    reschedule: string;
    rescheduleSoon: string;
    cancelBooking: string;
    cancelled: string;
    freeCancelNote: string;

    onTheWay: string;
    onSite: string;
    arrivingIn: string;
    started: string;
    washStatus: string;
    waiting: string;
    simulateNext: string;
    replay: string;

    documentation: string;
    documentationNote: (technician: string) => string;

    rateTechnician: (technician: string) => string;
    commentPlaceholder: string;
    attachPhotos: string;
    submitRating: string;
    ratingStars: (value: number) => string;
    thanksTitle: string;
    thanksBody: string;
    ratingSent: string;
  };

  profile: {
    verified: string;
    walletBalance: string;
    ofTotal: (total: number) => string;
    expires: (date: string) => string;
    clubCredits: string;
    renews: (date: string) => string;
    noBalanceTitle: string;
    noBalanceSub: (amount: string) => string;

    rows: {
      vehicles: string;
      addresses: string;
      cards: string;
      invoices: string;
      language: string;
      notifications: string;
      support: string;
      terms: string;
    };
    addressesValue: string;
    cardValue: string;
    notificationsOn: string;
    languageName: string;

    signOut: string;
    signedOut: string;
  };

  /** Catalogue entries whose names differ per language. */
  services: Record<Service['key'], { name: string; blurb: string; includes: string[] }>;
  addOns: Record<AddOn['key'], string>;
  plans: Record<Plan['id'], string>;
  packageLabel: Record<Package['id'], string>;
  beats: Record<BeatKey, { title: string; copy: string }>;
  technicianName: string;
  customerName: string;
  customerShort: string;
  customerInitial: string;
  vehicleName: string;
  addressLabel: string;
  addressLine: string;
  addressDistrict: string;
  /** Street and district joined with the right punctuation for the language. */
  addressFull: string;
  addressShort: string;
  days: string[];
  pastServices: Record<string, string>;
  pastDates: Record<string, string>;
  payMethods: Record<'mada' | 'visa' | 'apple', { label: string; detail: string }>;
  renewalDate: string;
  packageExpiry: string;
}
