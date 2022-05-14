import { RolePermission } from '../enums/permissions/role-permission.enum';
import { UserPermission } from '../enums/permissions/user-permission.enum';

const Permission = {
  ...RolePermission,
  ...UserPermission,
};

type Permission = RolePermission | UserPermission;

export default Permission;
