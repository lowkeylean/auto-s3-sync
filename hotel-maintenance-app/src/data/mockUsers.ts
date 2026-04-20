import type { User, Role } from '../types/user';

export const mockUsers: User[] = [
  // WORKERS
  { id: 'w-1', name: 'Ridho', role: 'worker', employmentType: 'contractor', subCategory: 'PMM Civil Hotel Room', tags: ['pmm', 'civil', 'hotel', 'room'], status: 'active' },
  { id: 'w-2', name: 'Amin', role: 'worker', employmentType: 'contractor', subCategory: 'PMM Civil Hotel Room', tags: ['pmm', 'civil', 'hotel', 'room'], status: 'active' },
  { id: 'w-3', name: 'Mahmudin', role: 'worker', employmentType: 'contractor', subCategory: 'PMM Civil Hotel Room', tags: ['pmm', 'civil', 'hotel', 'room'], status: 'active' },
  { id: 'w-4', name: 'Yosef', role: 'worker', employmentType: 'contractor', subCategory: 'PMM Civil Hotel Room', tags: ['pmm', 'civil', 'hotel', 'room'], status: 'active' },
  
  { id: 'w-5', name: 'Bimo', role: 'worker', employmentType: 'contractor', subCategory: 'PMM Residence Room', tags: ['pmm', 'residence', 'room'], status: 'active' },
  { id: 'w-6', name: 'Rhamdan', role: 'worker', employmentType: 'contractor', subCategory: 'PMM Residence Room', tags: ['pmm', 'residence', 'room'], status: 'active' },
  
  { id: 'w-7', name: 'Rangga', role: 'worker', employmentType: 'contractor', subCategory: 'FCU Hotel Room', tags: ['fcu', 'hotel', 'room'], status: 'active' },
  { id: 'w-8', name: 'Aldi', role: 'worker', employmentType: 'contractor', subCategory: 'FCU Hotel Room', tags: ['fcu', 'hotel', 'room'], status: 'active' },
  
  { id: 'w-9', name: 'Faiz', role: 'worker', employmentType: 'contractor', subCategory: 'FCU Residence Room', tags: ['fcu', 'residence', 'room'], status: 'active' },
  { id: 'w-10', name: 'Rifki', role: 'worker', employmentType: 'contractor', subCategory: 'FCU Residence Room', tags: ['fcu', 'residence', 'room'], status: 'active' },

  { id: 'w-11', name: 'Teguh', role: 'worker', employmentType: 'contractor', subCategory: 'AHU Maintenance', tags: ['ahu', 'maintenance'], status: 'active' },
  { id: 'w-12', name: 'Evan', role: 'worker', employmentType: 'contractor', subCategory: 'AHU Maintenance', tags: ['ahu', 'maintenance'], status: 'active' },

  { id: 'w-13', name: 'Rayhan', role: 'worker', employmentType: 'contractor', subCategory: 'Kitchen, Laundry', tags: ['kitchen', 'laundry'], status: 'active' },
  { id: 'w-14', name: 'Iip', role: 'worker', employmentType: 'contractor', subCategory: 'Kitchen, Laundry', tags: ['kitchen', 'laundry'], status: 'active' },
  { id: 'w-15', name: 'Farid', role: 'worker', employmentType: 'contractor', subCategory: 'Kitchen, Laundry', tags: ['kitchen', 'laundry'], status: 'active' },

  { id: 'w-16', name: 'Robansyah', role: 'worker', employmentType: 'contractor', subCategory: 'Civil Public Area', tags: ['civil', 'public-area'], status: 'active' },
  { id: 'w-17', name: 'Abdul Azis', role: 'worker', employmentType: 'contractor', subCategory: 'Civil Public Area', tags: ['civil', 'public-area'], status: 'active' },
  { id: 'w-18', name: 'Anwar', role: 'worker', employmentType: 'contractor', subCategory: 'Civil Public Area', tags: ['civil', 'public-area'], status: 'active' },
  { id: 'w-19', name: 'Ajis Bonsay', role: 'worker', employmentType: 'contractor', subCategory: 'Civil Public Area', tags: ['civil', 'public-area'], status: 'active' },

  { id: 'w-20', name: 'Ferdy', role: 'worker', employmentType: 'staff', subCategory: 'Engineer', tags: ['engineer'], status: 'active' },
  { id: 'w-21', name: 'Erick', role: 'worker', employmentType: 'staff', subCategory: 'Engineer', tags: ['engineer'], status: 'active' },
  { id: 'w-22', name: 'Widi', role: 'worker', employmentType: 'staff', subCategory: 'Engineer', tags: ['engineer'], status: 'active' },
  { id: 'w-23', name: 'Ipung', role: 'worker', employmentType: 'staff', subCategory: 'Engineer', tags: ['engineer'], status: 'active' },
  { id: 'w-24', name: 'Amarma', role: 'worker', employmentType: 'staff', subCategory: 'Engineer', tags: ['engineer'], status: 'active' },

  // SUPERVISORS
  { id: 's-1', name: 'Firdaus', role: 'supervisor', employmentType: 'contractor', subCategory: 'General', tags: ['general'], status: 'active' },
  { id: 's-2', name: 'Supriyanto', role: 'supervisor', employmentType: 'staff', subCategory: 'General', tags: ['general'], status: 'active' },
  { id: 's-3', name: 'Dedy', role: 'supervisor', employmentType: 'staff', subCategory: 'General', tags: ['general'], status: 'active' },
  { id: 's-4', name: 'Reza', role: 'supervisor', employmentType: 'staff', subCategory: 'General', tags: ['general'], status: 'active' },

  // MANAGERS
  { id: 'm-1', name: 'Sunny', role: 'manager', employmentType: 'staff', subCategory: 'General', tags: ['general'], status: 'active' },
  { id: 'm-2', name: 'Cahyo', role: 'manager', employmentType: 'staff', subCategory: 'General', tags: ['general'], status: 'active' },
  { id: 'm-3', name: 'Mainak', role: 'manager', employmentType: 'staff', subCategory: 'General', tags: ['general'], status: 'active' },

  // ADMINS
  { id: 'a-1', name: 'Tita', role: 'admin', employmentType: 'staff', subCategory: 'Administration', tags: ['administration'], status: 'active' },
  { id: 'a-2', name: 'Aida', role: 'admin', employmentType: 'staff', subCategory: 'Administration', tags: ['administration'], status: 'active' },
  { id: 'a-3', name: 'Ribka', role: 'admin', employmentType: 'contractor', subCategory: 'Administration', tags: ['administration'], status: 'active' },
  { id: 'a-4', name: 'Husmy', role: 'admin', employmentType: 'contractor', subCategory: 'Administration', tags: ['administration'], status: 'active' },
];

// Helper dictionaries for easy grouping in components
export const usersByRole = mockUsers.reduce((acc, user) => {
  if (!acc[user.role]) acc[user.role] = [];
  acc[user.role].push(user);
  return acc;
}, {} as Record<Role, User[]>);

export const workersBySubCategory = usersByRole['worker']?.reduce((acc, worker) => {
  const category = worker.subCategory || 'Uncategorized';
  if (!acc[category]) acc[category] = [];
  acc[category].push(worker);
  return acc;
}, {} as Record<string, User[]>) || {};
