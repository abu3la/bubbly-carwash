/** Formats a minor-unit amount ("halalas") as a localized currency string. */
export function formatMoney(priceMinor: number, currency: string, locale = 'en'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(priceMinor / 100);
}
