/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal } from '@angular/core';
import { ENV } from '@app/core/constants/global.constants';
import { Env } from '@app/core/types/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UseBackService {
  email = signal<string | null>(null);

  constructor(private http: HttpClient, @Inject(ENV) private env: Env) {}

  getUsers(): Observable<any> {
    return this.http.get(this.env + '/users');
  }
  getUserId(): number | null {
    let userId = 0;
    this.http.get(this.env.apiBaseUrl + '/users').subscribe((data: any) => {
      userId = data[0].id;
    });
    return userId;
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.env.apiBaseUrl}/userId/${id}`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.env.apiBaseUrl}/user/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.env.apiBaseUrl}/categories`);
  }

  createEvent(event: any) {
    return this.http.post(this.env.apiBaseUrl + '/event', event);
  }

  getEvents(page: number, totalEvents: number) {
    return this.http.get(`${this.env.apiBaseUrl}/events`, {
      params: {
        page: page,
        limit: totalEvents
      }
    });
  }

  getPaginatedEvents(page: number, totalEvents: number, search: string) {
    return this.http.get(`${this.env.apiBaseUrl}/eventsSearch`, {
      params: {
        page: page,
        limit: totalEvents,
        search: search
      }
    });
  }

  getEventByOrganizer(organizerId: number): Observable<any> {
    return this.http.get(`${this.env.apiBaseUrl}/event/organizer/${organizerId}`);
  }

  getEventById(id: number) {
    return this.http.get(`${this.env.apiBaseUrl}/event/id/${id}`);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.env.apiBaseUrl}/event/${id}`);
  }
  updateEvent(id: number, event: any) {
    return this.http.put(`${this.env.apiBaseUrl}/event/${id}/update/`, event);
  }
  setEventToProfile(eventId: number, userId: number) {
    return this.http.get(`${this.env.apiBaseUrl}/event/${eventId}/user/${userId}`);
  }
  getEventCodes(id: number, language: string) {
    return this.http.get(`${this.env.apiBaseUrl}/event/${id}/codes`, {
      params: {
        language: language
      },
      responseType: 'blob'
    });
  }
}
