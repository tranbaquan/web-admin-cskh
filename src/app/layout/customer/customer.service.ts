import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Pagination} from '../../shared/model/pagination';
import {map} from 'rxjs/operators';
import {CustomerResponseModel} from '../../shared/model/response/customer-response.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getCustomers(page: number, limit: number, params?: HttpParams): Observable<Pagination<CustomerResponseModel>> {
    const url = this.baseUrl + '/api/customer/getcustomerSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    return this.http.get(url, {headers, params}).pipe(
      map((response: any) => {
        const data = response.data;
        const pagination = new Pagination<CustomerResponseModel>();
        pagination.totalItem = data.totals;
        pagination.page = page;
        pagination.size = limit;
        pagination.totalPage = Math.ceil(data.totals / limit);
        pagination.data = data.data.map(obj => Object.assign(new CustomerResponseModel(), obj));
        return pagination;
      })
    );
  }

  getCustomerById(customerId: number): Observable<CustomerResponseModel> {
    const url = this.baseUrl + '/api/customer/getbyid/' + customerId;
    return this.http.get(url).pipe(
      map((response: any) => Object.assign(new CustomerResponseModel(), response.data))
    );
  }

  createCustomer(customer: CustomerResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/customer/create';
    return this.http.post(url, customer);
  }

  updateCustomer(customer: CustomerResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/customer/update';
    return this.http.post(url, customer);
  }

  deleteCustomer(customerId: number): Observable<any> {
    const url = this.baseUrl + '/api/customer/Delete/' + customerId;
    return this.http.delete(url);
  }

  getAllCompanies(): Observable<any> {
    const url = this.baseUrl + '/api/company/getAllCompany';
    const headers = new HttpHeaders().append('page', '1').append('limit', '10000');
    return this.http.get(url, {headers});
  }
}
