export type Role = 'admin' | 'manager' | 'supervisor' | 'worker' | 'super_admin';
export type EmploymentType = 'contractor' | 'staff';

export interface User {
  id: string;
  name: string;
  role: Role;
  employmentType: EmploymentType;
  subCategory?: string;
  tags: string[];
  status: 'active' | 'inactive';
}
