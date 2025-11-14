// Shared types for Worldz platform

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // e.g. 'Full-time', 'Part-time'
  salary: string;
  description: string;
  requirements: string[];
  postedBy: string; // user id
  createdAt: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  description: string;
  requirements: string[];
  postedBy: string; // user id
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId?: string;
  internshipId?: string;
  videoUrl?: string;
  coverLetter?: string;
  createdAt: string;
} 