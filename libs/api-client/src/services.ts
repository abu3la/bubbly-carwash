import type { Service } from '@bubbly/types';
import type { CreateServiceInput } from '@bubbly/validation';
import { request } from './client';

export const servicesService = {
  list: () => request<Service[]>('/services'),
  create: (input: CreateServiceInput) =>
    request<Service>('/services', { method: 'POST', body: JSON.stringify(input) }),
};
