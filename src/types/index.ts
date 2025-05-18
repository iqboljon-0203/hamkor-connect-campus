
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  internshipLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  createdBy: string;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  joinedAt: string;
}

export type TaskType = 'homework' | 'internship';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  deadline: string; // ISO date string
  groupId: string;
  createdBy: string;
  fileUrl?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  content?: string;
  fileUrl?: string;
  location?: {
    lat: number;
    lng: number;
  };
  submittedAt: string;
  rating?: number;
  feedback?: string;
  status: 'pending' | 'approved' | 'rejected';
}
