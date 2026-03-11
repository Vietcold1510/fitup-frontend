export enum AccountRole {
  User = 0,
  PT = 1,
  Admin = 2,
  Staff = 3,
}

export const getRoleName = (role: AccountRole): string => {
  switch (role) {
    case AccountRole.PT: return "Personal Trainer";
    case AccountRole.Admin: return "Quản trị viên";
    case AccountRole.Staff: return "Nhân viên";
    default: return "Người dùng";
  }
};

// Hàm kiểm tra xem người dùng có quyền thực hiện hành động nào đó không
export const hasPermission = (userRole: AccountRole, requiredRoles: AccountRole[]): boolean => {
  return requiredRoles.includes(userRole);
};