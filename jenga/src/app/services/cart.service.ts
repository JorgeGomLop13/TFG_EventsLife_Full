import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENV } from '@app/core/constants/global.constants';
import { Env } from '@app/core/types/env';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient, @Inject(ENV) private env: Env) {}

  setEventToCart(eventId: number, userId: number) {
    return this.http.get(`${this.env.apiBaseUrl}/event/${eventId}/user/${userId}`);
  }

  getCartEventsByIds(userId: number) {
    return this.http.get(`${this.env.apiBaseUrl}/eventsFromIds/${userId}`);
  }

  getHistoryEventsByIds(userId: number) {
    return this.http.get(`${this.env.apiBaseUrl}/history/${userId}`);
  }

  deleteEventFromCart(userId: number, EventId: number) {
    return this.http.delete(`${this.env.apiBaseUrl}/user/${userId}/events/${EventId}`);
  }

  setEventToHistory(userId: number, eventId: number) {
    return this.http.post(`${this.env.apiBaseUrl}/setEventToHistory`, {
      userId: userId,
      eventId: eventId
    });
  }
  sendEmail(subject: string, html: string, email: string) {
    return this.http.post(`${this.env.apiBaseUrl}/sendEmail`, {
      subject: subject,
      html: html,
      email: email
    });
  }
  setCodeToEvent(eventId: number, code: string) {
    return this.http.post(`${this.env.apiBaseUrl}/setCodeToEvent`, {
      eventId: eventId,
      code: code
    });
  }
}
