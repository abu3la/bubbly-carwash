import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../env';
import { db } from '../db';
import { normalizeVilla, validVilla } from '../coverage';

export const coverageAdminRoute = new Hono<{ Bindings: Env }>();
// Mounted only under adminRoute, whose authentication and admin role guards
// run before every child route. Do not duplicate remote session verification.
const point = z.object({ lat: z.number().finite().min(-90).max(90), lng: z.number().finite().min(-180).max(180) }).strict();
const areaSchema = z.object({
  nameAr: z.string().trim().min(2).max(100), nameEn: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100), boundary: z.array(point).max(500).optional(),
  boundaryVerified: z.boolean().optional(), active: z.boolean().optional(),
  centerLat: z.number().finite().min(-90).max(90).optional(), centerLng: z.number().finite().min(-180).max(180).optional(),
}).strict();
const blockSchema = z.object({
  areaId: z.string().min(1).max(100), code: z.string().trim().min(1).max(12).regex(/^[A-Za-z0-9-]+$/),
  nameAr: z.string().trim().min(1).max(100), nameEn: z.string().trim().min(1).max(100),
  teamId: z.string().min(1).max(100), active: z.boolean().optional(),
}).strict();
const fieldMap: Record<string, string> = {
  nameAr: 'name_ar', nameEn: 'name_en', areaId: 'area_id', teamId: 'team_id',
  boundaryVerified: 'boundary_verified', centerLat: 'center_lat', centerLng: 'center_lng',
};
function dbFields(input: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [fieldMap[key] ?? key, key === 'code' ? String(value).toUpperCase() : value]));
}
function failure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('23505')) return 'duplicateCoverageEntry';
  if (message.includes('23503')) return 'coverageReferenceNotFound';
  if (message.includes('invalidBoundary')) return 'invalidBoundary';
  if (message.includes('boundaryRequired')) return 'boundaryRequired';
  if (message.includes('23514')) return 'invalidCoverageInput';
  return null;
}
coverageAdminRoute.onError((error, c) => {
  const code = failure(error);
  if (code) return c.json({ error: { code } }, 409);
  console.error('[coverage-admin]', error);
  return c.json({ error: { code: 'coverageSaveFailed' } }, 500);
});

coverageAdminRoute.get('/', async (c) => {
  const [areas, teams] = await Promise.all([
    db(c.env, 'coverage_areas?select=*,blocks:coverage_blocks(*,villas:coverage_villas(*))&order=created_at'),
    db(c.env, 'teams?select=id,name_ar,name_en,active&order=sort'),
  ]);
  return c.json({ areas, teams });
});
coverageAdminRoute.post('/areas', async (c) => {
  const parsed = areaSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: { code: 'invalidCoverageInput' } }, 400);
  const [area] = await db(c.env, 'coverage_areas', { method: 'POST', prefer: 'return=representation', body: { id: crypto.randomUUID(), ...dbFields(parsed.data) } });
  return c.json({ area }, 201);
});
coverageAdminRoute.patch('/areas/:id', async (c) => {
  const parsed = areaSchema.partial().safeParse(await c.req.json());
  if (!parsed.success || !Object.keys(parsed.data).length) return c.json({ error: { code: 'invalidCoverageInput' } }, 400);
  const fields = dbFields(parsed.data);
  // Editing geometry clears verification unless the operator explicitly verifies the replacement.
  if (parsed.data.boundary !== undefined && parsed.data.boundaryVerified !== true) fields.boundary_verified = false;
  const [area] = await db(c.env, `coverage_areas?id=eq.${encodeURIComponent(c.req.param('id'))}`, { method: 'PATCH', prefer: 'return=representation', body: fields });
  if (!area) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ area });
});
coverageAdminRoute.post('/blocks', async (c) => {
  const parsed = blockSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: { code: 'invalidCoverageInput' } }, 400);
  const [block] = await db(c.env, 'coverage_blocks', { method: 'POST', prefer: 'return=representation', body: { id: crypto.randomUUID(), ...dbFields(parsed.data) } });
  return c.json({ block }, 201);
});
coverageAdminRoute.patch('/blocks/:id', async (c) => {
  // Area identity is immutable: moving it would corrupt historical villa associations.
  const parsed = blockSchema.omit({ areaId: true }).partial().safeParse(await c.req.json());
  if (!parsed.success || !Object.keys(parsed.data).length) return c.json({ error: { code: 'invalidCoverageInput' } }, 400);
  const [block] = await db(c.env, `coverage_blocks?id=eq.${encodeURIComponent(c.req.param('id'))}`, { method: 'PATCH', prefer: 'return=representation', body: dbFields(parsed.data) });
  if (!block) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ block });
});
coverageAdminRoute.post('/villas', async (c) => {
  const parsed = z.object({ blockId: z.string().min(1).max(100), villaNumbers: z.array(z.string().max(100)).min(1).max(500), active: z.boolean().optional() }).strict().safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: { code: 'invalidCoverageInput' } }, 400);
  const numbers = parsed.data.villaNumbers.map(normalizeVilla);
  if (numbers.some((number) => !validVilla(number))) return c.json({ error: { code: 'invalidVillaNumber' } }, 400);
  if (new Set(numbers).size !== numbers.length) return c.json({ error: { code: 'duplicateCoverageEntry' } }, 409);
  const [block] = await db<{ id: string; area_id: string }>(c.env, `coverage_blocks?id=eq.${encodeURIComponent(parsed.data.blockId)}&select=id,area_id`);
  if (!block) return c.json({ error: { code: 'coverageReferenceNotFound' } }, 404);
  const villas = await db(c.env, 'coverage_villas', { method: 'POST', prefer: 'return=representation', body: numbers.map((number) => ({ area_id: block.area_id, block_id: block.id, villa_number: number, active: parsed.data.active ?? true })) });
  return c.json({ villas }, 201);
});
coverageAdminRoute.patch('/villas/:id', async (c) => {
  const parsed = z.object({ active: z.boolean() }).strict().safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: { code: 'invalidCoverageInput' } }, 400);
  const [villa] = await db(c.env, `coverage_villas?id=eq.${encodeURIComponent(c.req.param('id'))}`, { method: 'PATCH', prefer: 'return=representation', body: parsed.data });
  if (!villa) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ villa });
});
