export const ROLES = ["admin", "member", "guest"] as const;
export const PERMISSIONS = ["editor", "viewer"] as const;

export type Role = (typeof ROLES)[number];
export type Permission = (typeof PERMISSIONS)[number];

export interface ComplexFormData {
  name: string;
  age: number;
  role: Role;
  permission: Permission;
  isForeigner: boolean;
}
