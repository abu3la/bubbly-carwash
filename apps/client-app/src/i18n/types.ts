import type { AddOn, Plan, Service, Slot } from '../content';
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
    locationRequired: string;
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
    developmentCodeHint: (code: string) => string;
    resendIn: (time: string) => string;
    resendNow: string;
    resend: string;
    verify: string;

    profileTitle: string;
    profileHeading: string;
    profileSub: string;
    fullNamePlaceholder: string;

    locationTitle: string;
    locationBlurb: string;
    allowLocation: string;
    enterManually: string;

    searchPlaceholder: string;
    mapNote: string;
    servedHere: string;
    checkingArea: string;
    outsideArea: string;
    areaCheckFailed: string;
    droppedPin: string;
    confirmLocation: string;
    useCurrentLocation: string;
    currentLocationUnavailable: string;

    addressTitle: string;
    addressHeading: string;
    addressLabelSection: string;
    addressManualSub: string;
    addressLinePlaceholder: string;
    addressLabels: string[];
    accessNotes: string;
    accessNotesPlaceholder: string;
    saveAndContinue: string;
    saveLocation: string;
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
    club: string;
    clubTeaser: string;
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
    periods: Record<Slot['period'], string>;
    fridayOff: string;
    checkingAvailability: string;
    teamAvailable: (team: string, distanceKm: number, capacity: number) => string;
    outsideTeamArea: string;
    dayFull: string;
    remainingSlots: (count: number) => string;

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
    paymentFailed: string;
    processingCredit: string;
    processingCreditSub: string;

    paidTitle: string;
    creditTitle: string;
    successSub: string;
    trackWash: string;
    backHome: string;
  };

  club: {
    title: string;
  };

  profile: {
    verified: string;
    rows: {
      vehicles: string;
      addresses: string;
      language: string;
    };
    languageName: string;
    signOut: string;
    signedOut: string;
  };

  /** Catalogue entries whose names differ per language. */
  services: Record<Service['key'], { name: string; blurb: string; includes: string[] }>;
  addOns: Record<AddOn['key'], string>;
  plans: Record<Plan['id'], string>;
  beats: Record<BeatKey, { title: string; copy: string }>;
}
