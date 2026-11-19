export type UserRole = 'Customer' | 'Admin';

export type User = {
  id: string;
  email: string;
  role: UserRole;
};

export function parseUserRole(value: unknown): UserRole {
  return value === 'Admin' ? 'Admin' : 'Customer';
}
