import type { Service } from '@sama/types';
import type { CreateServiceInput } from '@sama/validation';
import { request } from './client';

export const servicesService = {
  list: () => request<Service[]>('/services'),
  create: (input: CreateServiceInput) =>
    request<Service>('/services', { method: 'POST', body: JSON.stringify(input) }),
};
