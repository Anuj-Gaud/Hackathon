// filepath: job-connect/src/types.ts
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: number;
  type?: string;
  [key: string]: any;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  stipend?: number;
  duration?: string;
  type?: string;
  [key: string]: any;
}