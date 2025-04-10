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
  // Si vous avez besoin de récupérer les jobId par titre
  getJobIdByTitle(title: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/jobs/title/${encodeURIComponent(title)}`
    );
  }

  getApplicationById(id: number) {
    return this.http.get(`${this.apiUrl}/applications/${id}`);
  }

  // filterCandidatesByJob(jobId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/applications/filter/${jobId}`);
  // }
  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs`);
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
