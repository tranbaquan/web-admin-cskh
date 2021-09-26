import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getAllStore(): Observable<any> {
    const url = this.baseUrl + '/api/Stores/getAllStore';
    const headers = new HttpHeaders().append('page', '1').append('limit', '1000');
    return this.http.get(url, {headers});
  }
}
