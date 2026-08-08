import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(2),
  description: z.string().default(''),
  priceMinor: z.number().int().nonnegative(),
  currency: z.string().length(3).default('SAR'),
  durationMinutes: z.number().int().positive(),
  active: z.boolean().default(true),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
