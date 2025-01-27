import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable, tap } from 'rxjs';
import { Appliance } from '../models/appliance';

@Injectable({
  providedIn: 'root'
})
export class ApplianceService {
  private baseUrl = 'http://localhost:3000/appliances';

  constructor(private http: HttpClient) {}

  getAppliances(): Observable<Appliance[]> {
    return this.http.get<Appliance[]>(this.baseUrl)
    .pipe(first());
  }

  getApplianceById(id: string): Observable<Appliance[]> {
    return this.http.get<Appliance[]>(`${this.baseUrl}/${id}`);
  }

  addAppliance(appliance: Appliance): Observable<Appliance> {
    return this.http.post<Appliance>(this.baseUrl, appliance);
  }

  updateAppliance(id: string, appliance: Appliance): Observable<Appliance> {
    return this.http.put<Appliance>(`${this.baseUrl}/${id}`, appliance);
  }

  deleteAppliance(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

