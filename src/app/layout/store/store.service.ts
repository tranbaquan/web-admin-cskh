import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Pagination} from '../../shared/model/pagination';
import {map} from 'rxjs/operators';
import {StoreResponseModel} from '../../shared/model/response/store-response.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }


  getAllStores(): Observable<StoreResponseModel[]> {
    const url = this.baseUrl + '/api/Stores/getAllStore';
    const headers = new HttpHeaders().append('page', '1').append('limit', '100000');
    return this.http.get(url, {headers}).pipe(
      map((response: any) => response.data.data.map(data => Object.assign(new StoreResponseModel(), data)))
    );
  }

  getStores(page: number, limit: number, params?: HttpParams): Observable<Pagination<StoreResponseModel>> {
    const url = this.baseUrl + '/api/Stores/getAllStore';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    return this.http.get(url, {headers, params}).pipe(
      map((response: any) => {
        const data = response.data;
        const pagination = new Pagination<StoreResponseModel>();
        pagination.totalItem = data.totals;
        pagination.page = page;
        pagination.size = limit;
        pagination.totalPage = Math.ceil(data.totals / limit);
        pagination.data = data.data.map(obj => Object.assign(new StoreResponseModel(), obj));
        return pagination;
      })
    );
  }

  getStoreById(storeId: number): Observable<StoreResponseModel> {
    const url = this.baseUrl + '/api/Stores/getstorebyid/' + storeId;
    return this.http.get(url).pipe(
      map((response: any) => Object.assign(new StoreResponseModel(), response.data))
    );
  }

  createStore(store: StoreResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/Stores/create';
    return this.http.post(url, store);
  }

  updateStore(store: StoreResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/Stores/update';
    return this.http.post(url, store);
  }

  deleteStore(storeId: number): Observable<any> {
    const url = this.baseUrl + '/api/Stores/delete/' + storeId;
    return this.http.delete(url);
  }
}
