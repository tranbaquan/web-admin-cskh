import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {NewResponseModel} from "../../shared/model/response/new-response.model";

@Injectable({
  providedIn: 'root'
})
export class NewService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  searchNews(page: number, limit: number, keySearch: string, status: string, typeId: string): Observable<any> {
    const url = this.baseUrl + '/api/news/getNewsSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    const params = new HttpParams()
      .set('typeNewsID', typeId)
      .set('keySearch', keySearch)
      .set('status', status);
    return this.http.get(url, {headers, params});
  }

  getNewType(page: number, limit: number): Observable<any> {
    const url = this.baseUrl + '/api/typenews/getAllTypeNews';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    return this.http.get(url, {headers});
  }

  createNew(data: NewResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/news/create';
    return this.http.post(url, data);
  }

  deleteNew(newId: number): Observable<any> {
    const url = this.baseUrl + '/api/news/delete/' + newId;
    return this.http.delete(url);
  }

  updateNew(data: NewResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/news/update';
    return this.http.post(url, data);
  }
}
