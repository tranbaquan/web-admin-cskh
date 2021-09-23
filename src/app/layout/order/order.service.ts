import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Pagination} from '../../shared/model/pagination';
import {OrderResponseModel} from '../../shared/model/response/order-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getOrder(page: number, limit: number, keySearch: string, status: string, isAcept: string ): Observable<any> {
    const url = this.baseUrl + '/api/exportstore/getExportStoreSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    const params = new HttpParams();
    params.append('typeExportID', '1');
    params.append('keySearch', keySearch);
    params.append('status', status);
    params.append('isAccept', isAcept);
    return this.http.get(url, {headers, params});
  }
}
