import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Pagination} from '../../shared/model/pagination';
import {map} from 'rxjs/operators';
import {SurchargeResponseModel} from '../../shared/model/response/surcharge-response.model';

@Injectable({
  providedIn: 'root'
})
export class SurchargeService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getSurcharges(page: number, limit: number, params?: HttpParams): Observable<Pagination<SurchargeResponseModel>> {
    const url = this.baseUrl + '/api/surcharge/getSurchargeSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    return this.http.get(url, {headers, params}).pipe(
      map((response: any) => {
        const data = response.data;
        const pagination = new Pagination<SurchargeResponseModel>();
        pagination.totalItem = response.totals;
        pagination.page = page;
        pagination.size = limit;
        pagination.totalPage = Math.ceil(response.totals / limit);
        pagination.data = data.map(obj => Object.assign(new SurchargeResponseModel(), obj));
        return pagination;
      })
    );
  }

  getSurchargeById(surchargeId: number): Observable<SurchargeResponseModel> {
    const url = this.baseUrl + '/api/surcharge/getSurchargeByID/' + surchargeId;
    return this.http.get(url).pipe(
      map((response: any) => Object.assign(new SurchargeResponseModel(), response.data))
    );
  }

  createSurcharge(surcharge: SurchargeResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/surcharge/create';
    return this.http.post(url, surcharge);
  }

  updateSurcharge(surcharge: SurchargeResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/surcharge/update';
    return this.http.post(url, surcharge);
  }

  deleteSurcharge(surchargeId: number): Observable<any> {
    const url = this.baseUrl + '/api/surcharge/Delete/' + surchargeId;
    return this.http.delete(url);
  }
}
