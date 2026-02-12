
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Terminated' | 'Draft';
  joinDate: string;
  email: string;
  profileImageId?: string; // Google Drive File ID
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  photo_drive_id?: string;
  is_active: boolean;
  search_all?: string; // Generated column from Supabase
}

export interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
  late: number;
}
