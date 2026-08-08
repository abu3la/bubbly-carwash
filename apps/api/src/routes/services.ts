import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createServiceSchema } from '@bubbly/validation';
import type { Env } from '../env';
import { getRepository } from '../repo';

export const servicesRoute = new Hono<{ Bindings: Env }>()
  .get('/', async (c) => {
    const services = await getRepository(c.env).listServices();
    return c.json(services);
  })
  .post('/', zValidator('json', createServiceSchema), async (c) => {
    const service = await getRepository(c.env).createService(c.req.valid('json'));
    return c.json(service, 201);
  });
