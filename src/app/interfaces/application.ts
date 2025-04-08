export interface Application {
    id: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    candidate: {
      id: number;
      name: string;
      email: string;
    };
    jobId: number;
    cvUrl: string;
    coverLetterUrl?: string;
    portfolioUrl?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface StatusUpdate {
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  }