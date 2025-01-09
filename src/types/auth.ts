export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}