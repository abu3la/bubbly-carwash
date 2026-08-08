export interface Service {
  id: string;
  name: string;
  description: string;
  /** Price in the smallest currency unit (halalas). */
  priceMinor: number;
  currency: string;
  durationMinutes: number;
  active: boolean;
}
