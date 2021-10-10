import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CompanyResponseModel} from '../../shared/model/response/company-response.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getAllCompany(page: number, limit: number): Observable<any> {
    const url = this.baseUrl + '/api/company/getAllCompany';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    return this.http.get(url, {headers});
  }

  createCompany(company: CompanyResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/company/create';
    return this.http.post(url, company).pipe(
      map((data: any) => Object.assign(new CompanyResponseModel(), data.data))
    );
  }

  updateCompany(company: CompanyResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/company/update';
    return this.http.post(url, company);
  }

  deleteCompany(companyId: number): Observable<any> {
    const url = this.baseUrl + '/api/company/delete/' + companyId;
    return this.http.delete(url);
  }
}
