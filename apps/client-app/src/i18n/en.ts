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
    outsideServiceArea: 'We currently serve Makkah only. Pick a location inside the service area.',
    locationRequired: 'Choose the location on the map so the wash team can reach you.',
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

    profileTitle: 'Your details',
    profileHeading: 'What is your name?',
    profileSub: 'Your wash team will see your name with the booking details.',
    fullNamePlaceholder: 'Full name',

    locationTitle: 'Where’s your car?',
    locationBlurb:
      'We use your location to show the prices and slots that are actually available near you — before you commit to anything.',
    allowLocation: 'Allow location',
    enterManually: 'Choose on the map instead',

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
    addressLinePlaceholder: 'e.g. Villa 12, Ibrahim Al Juffali Street, Al Awali',
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
    club: 'Bubbles Club',
    clubTeaser: 'Basic or Super Wash: two or three washes weekly',
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
    holdNote: 'We hold your slot for 15 minutes while you pay.',
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
    creditTitle: 'Your subscription appointment is confirmed',
    successSub: 'We’ll notify you when a technician is assigned and before they arrive.',
    trackWash: 'Track the wash',
    backHome: 'Back to home',
  },

  club: { title: 'Bubbles Club' },

  profile: {
    verified: 'Verified',
    rows: {
      vehicles: 'My cars',
      addresses: 'My addresses',
      language: 'Language',
    },
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

  beats: {
    arrived: { title: 'Arrived', copy: 'The technician is at your gate.' },
    washed: { title: 'Washed', copy: 'Wash complete — drying now.' },
    verified: { title: 'Verified', copy: 'Quality checked — before-and-after evidence is ready.' },
  },
};
