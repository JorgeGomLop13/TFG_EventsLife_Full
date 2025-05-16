import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LocationService {
  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get(`http://localhost:3000/location/countries`);
  }
  getCommunities() {
    return this.http.get(`http://localhost:3000/location/communities`);
  }
  getProvinces(communityId: string) {
    return this.http.get(`http://localhost:3000/location/provinces/${communityId}`);
  }
}
