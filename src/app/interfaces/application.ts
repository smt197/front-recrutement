export interface Application {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PRESELECTED' | 'INTERVIEW_SCHEDULED';
  candidate: {
    id: number;
    name: string;
    email: string;
    experience?: number;
    skills?: string[];
  };
  job: {
    id: number;
    title: string;
    experience?: number;
    skills?: string[];
  };
  jobId: number;
  cvUrl: string;
  coverLetterUrl?: string;
  portfolioUrl?: string;
  matchScore?: number | null;
  aiAnalysis?: {
    score?: number;
    decision?: string;
    recommendation?: string;
    matchedSkills?: string[];
    missingSkills?: string[];
    analysis?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface StatusUpdate {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PRESELECTED' | 'INTERVIEW_SCHEDULED';
}
