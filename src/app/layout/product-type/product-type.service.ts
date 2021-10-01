import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  baseUrl: string;

  constructor(private http: HttpClient) { }

  getAllTypeProduct(page: number, limit: number, status: string): Observable<any> {
    const url = this.baseUrl + '/api/typeproduct/gettypeproductSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    const params = new HttpParams()
      .set('status', status);
    return this.http.get(url, {headers, params});
  }


}
