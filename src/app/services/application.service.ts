// application.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Application, StatusUpdate } from '../interfaces/application';
import { PaginatedResponse } from '../interfaces/PaginateResponse';
import { Job, PaginatedResponseJob } from '../interfaces/job';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getApplications(
    page: number = 1,
    limit: number = 10
  ): Observable<PaginatedResponse<Application>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Application>>(
      `${this.apiUrl}/applications`,
      { params }
    );
  }

  getAllJobTitles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/jobs/titles`);
  }

  getApplicationsByJobTitle(title: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/applications/job/by-title/${encodeURIComponent(title)}/candidates`
    );
  }

  filterApplicationsByJobTitle(title: string): Observable<Application[]> {
    return this.http.get<Application[]>(
      `${this.apiUrl}/applications/filter/${encodeURIComponent(title)}`
    );
  }
  getJobIdByTitle(title: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/jobs/title/${encodeURIComponent(title)}`
    );
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`);
  }

  updateJob(id: number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/jobs/${id}`, jobData);
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/jobs/${id}`);
  }

  getApplicationById(id: number) {
    return this.http.get(`${this.apiUrl}/applications/${id}`);
  }

  getAllJobs(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Observable<PaginatedResponseJob<Job>> {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    let params = new HttpParams()
      .set('page', pageNum.toString())
      .set('limit', limitNum.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponseJob<Job>>(`${this.apiUrl}/jobs`, {
      params
    });
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/jobs/add`, jobData);
  }

  updateStatus(
    applicationId: number,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PRESELECTED'
  ): Observable<Application> {
    return this.http
      .patch<Application>(
        `${this.apiUrl}/applications/${applicationId}/status`,
        { status } as StatusUpdate
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
