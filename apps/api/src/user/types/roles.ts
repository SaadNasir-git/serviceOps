import { userRoleEnum } from '@repo/database';

export type Role = (typeof userRoleEnum.enumValues)[number];

export const Role = {
  Customer: 'customer',
  Technician: 'technician',
  Admin: 'admin',
} as const satisfies Record<string, Role>;