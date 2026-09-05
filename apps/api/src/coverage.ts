import { db } from './db';
import type { Env } from './env';

export interface CoverageResult {
  status: 'outside' | 'villaRequired' | 'villaUnavailable' | 'covered' | 'areaUnavailable';
  area: { id: string; name: { ar: string; en: string }; city: string } | null;
  block: { id: string; code: string; name: { ar: string; en: string } } | null;
  team: { id: string; name: { ar: string; en: string } } | null;
  villaNumber: string | null;
}

export function normalizeVilla(value: string): string {
  return value.trim().replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/\s/g, '').toUpperCase();
}

export function validVilla(value: string): boolean {
  return value.length <= 24 && /^[A-Z0-9]+(?:[-/][A-Z0-9]+)*$/.test(value) && /[0-9]/.test(value);
}

export async function checkCoverage(env: Env, lat: number, lng: number, villaNumber?: string | null): Promise<CoverageResult> {
  const [result] = await db<CoverageResult>(env, 'rpc/check_coverage', {
    method: 'POST', body: { p_lat: lat, p_lng: lng, p_villa_number: villaNumber ? normalizeVilla(villaNumber) : null },
  });
  if (!result) throw new Error('coverageUnavailable');
  return result;
}

export const coverageError = (status: CoverageResult['status']) => ({
  outside: 'outsideServiceArea',
  villaRequired: 'villaRequired',
  villaUnavailable: 'villaUnavailable',
  areaUnavailable: 'coverageUnavailable',
  covered: 'covered',
}[status]);
