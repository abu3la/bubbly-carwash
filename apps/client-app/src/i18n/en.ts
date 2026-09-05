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
    securePayment: 'Secure payment through a certified gateway. we never store your card.',
  },

  authErrors: {
    wrongCode: 'That code is wrong or has expired. Request a new one.',
    tooManyRequests: 'Too many attempts. Wait a minute and try again.',
    invalidPhone: "That phone number doesn't look right. Check it and try again.",
    offline: 'No internet connection. Check your network.',
    unknown: "That didn't go through. Please try again.",
  },

  addressErrors: {
    villaRequired: 'Enter your villa number to check coverage.',
    villaUnavailable: 'This villa is not available. Check the number or try later.',
    invalidVillaNumber: 'Enter the number shown on your villa.',
    coverageUnavailable: 'This area is not available right now. Try later.',
    outsideServiceArea: 'We currently serve Sharbatly Village, Jeddah only. Choose your villa location inside the area.',
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
    plateRequired: 'Enter the plate. the technician needs it to find your car.',
    unauthorized: 'Your session expired. Please sign in again.',
    offline: 'No internet connection. Check your network.',
    unknown: "We couldn't save the car. Please try again.",
  },

  vehicleSizes: ['Sedan', 'SUV', 'Pickup'],

  tabs: { home: 'Home', bookings: 'Bookings', profile: 'Account' },

  onboarding: {
    blurb: 'Subscribe to monthly washes at home and choose your weekly schedule.',
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
      'We serve Sharbatly Village, Jeddah. Choose your location, then enter your villa number to check coverage.',
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
    addressLinePlaceholder: 'Street or directions inside Sharbatly Village',
    addressLabels: ['Home', 'Work', 'Other'],
    accessNotes: 'Access notes (optional)',
    accessNotesPlaceholder: 'Blue gate, next to the mosque',
    saveAndContinue: 'Save and continue',
    saveLocation: 'Save location',
    vehicleTitle: 'Your car',
    vehicleHeading: 'Register your car',
    vehicleSub: 'So the technician recognises it when they arrive.',
    vehicleMake: 'Make. e.g. Lexus',
    vehicleModel: 'Model. e.g. LX 600',
    vehicleColour: 'Colour. e.g. white',
    vehiclePlate: 'Plate number',
    vehicleSizeSection: 'Body type',
  },

  home: {
    planName: (name) => `${name} plan`,
    weeklyWashes: (count) => `${count} ${count === 1 ? 'wash' : 'washes'} per week`,
    selectedDays: 'Selected wash days',
    scheduleUnavailable: 'Weekly schedule unavailable. Check your wash appointments.',
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    retryWash: 'Try again',
    nextWash: 'Your next wash',
    currentWash: 'Wash in progress',
    scheduled: 'Scheduled',
    washStages: { booked: 'In progress', arrived: 'Team arrived', washed: 'Wash complete', verified: 'Evidence complete' },
    viewWash: 'View wash details',
    refreshWash: 'Could not update your appointment. Retry',
    loadingWash: 'Loading your wash appointment…',
    washLoadError: 'Could not load your appointment. Try again.',
    noUpcomingWash: 'No upcoming wash',
    chooseWashTime: 'Choose a time that suits you from the available appointments.',
    scheduleWash: 'Schedule a wash',
    greeting: (name) => `Hello, ${name}`,
    subscriptionTitle: 'Regular washes, one monthly plan',
    monthlyCycle: 'per 30-day cycle',
    clubTeaser: 'Basic or Super Wash: two or three washes weekly',
    join: 'Subscribe now',
    myClub: 'Manage my subscription',
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
    takenNoteMember: 'Only available appointments for your address are shown.',
    prioritySlot: 'Available',
    holdNote: 'We hold your slot for 15 minutes while you pay.',
    periods: { morning: 'Morning', afternoon: 'Afternoon', night: 'Night' },
    fridayOff: 'Teams are off on Friday',
    checkingAvailability: 'Checking your block team’s appointments…',
    teamAvailable: (team) =>
      `${team} is responsible for your villa’s block`,
    outsideTeamArea: 'Your location is outside the active team’s area right now.',
    dayFull: 'The team is full for this day. Pick another day.',
    remainingSlots: (count) => `${count} left`,

    addOnsSection: 'Optional extras',
    addOnWithPrice: (label, price) => `${label} (+${price})`,
    useCredit: 'Use a package credit',
    useCreditSub: (credits) => `You have ${credits} washes. one will be used`,
    creditCoversWashOnly: 'A credit covers the wash only. extras are paid separately.',
    fromPackage: (service) => `${service}. from your package`,
    fromClub: (service) => `${service}. from your monthly package`,
    oneWash: '1 wash',

    paySourceSection: 'How you are paying',
    sourceClub: 'Use a monthly-package wash',
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
    processingPaymentSub: 'Don’t close the app. you won’t be charged twice.',
    paymentFailed: 'Payment was not completed. The booking was not confirmed and you can try again.',
    processingCredit: 'Confirming your booking…',
    processingCreditSub: 'Adding this appointment to your weekly washes.',

    paidTitle: 'Paid. your booking is confirmed',
    creditTitle: 'Your subscription appointment is confirmed',
    successSub: 'We’ll notify you when a technician is assigned and before they arrive.',
    trackWash: 'Track the wash',
    backHome: 'Back to home',
  },

  club: { title: 'Monthly packages' },

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
    washed: { title: 'Washed', copy: 'Wash complete. drying now.' },
    verified: { title: 'Verified', copy: 'Quality checked. before-and-after evidence is ready.' },
  },
};
