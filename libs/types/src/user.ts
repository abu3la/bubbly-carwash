export type UserRole = 'client' | 'driver' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string | null;
  createdAt: string;
}
