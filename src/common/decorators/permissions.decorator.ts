import { SetMetadata } from '@nestjs/common';
import Permission from '../types/permission.type';

export const PERMISSIONS_KEY = 'permissions';
export const Roles = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
