import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Pagination} from '../../shared/model/pagination';
import {ProductResponseModel} from '../../shared/model/response/product-response.model';
import {map} from 'rxjs/operators';
import {ProducerResponseModel} from '../../shared/model/response/producer-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getProducts(page: number, limit: number, params?: HttpParams): Observable<Pagination<ProductResponseModel>> {
    const url = this.baseUrl + '/api/products/getproductSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    return this.http.get(url, {headers, params}).pipe(
      map((response: any) => {
        const data = response.data;
        const pagination = new Pagination<ProductResponseModel>();
        pagination.totalItem = data.totals;
        pagination.page = page;
        pagination.size = limit;
        pagination.totalPage = Math.ceil(data.totals / limit);
        pagination.data = data.data.map(obj => Object.assign(new ProductResponseModel(), obj));
        return pagination;
      })
    );
  }

  getProductById(productId: number): Observable<ProductResponseModel> {
    const url = this.baseUrl + '/api/products/getproductbyid/' + productId;
    return this.http.get(url).pipe(
      map((response: any) => Object.assign(new ProductResponseModel(), response.data))
    );
  }

  getAllProducers(): Observable<any> {
    const url = this.baseUrl + '/api/productproduction/getProductProductionAll';
    const headers = new HttpHeaders().append('page', '1').append('limit', '10000');
    return this.http.get(url, {headers}).pipe(
      map((response: any) => response.data.data)
    );
  }

  getAllProducers1(): Observable<any> {
    const url = this.baseUrl + '/api/production/getAllProduction';
    const headers = new HttpHeaders().append('page', '1').append('limit', '10000');
    return this.http.get(url, {headers}).pipe(
      map((response: any) => response.data.data)
    );
  }

  createProducer(producer: ProducerResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/production/create';

    return this.http.post(url, producer);
  }

  updateProduct(product: ProductResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/products/update';
    return this.http.post(url, product);
  }

  createProduct(product: ProductResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/products/create';
    return this.http.post(url, product);
  }

  getPrices(productId: number, user: string): Observable<any> {
    const url = this.baseUrl + '/api/products/getproductspecproductionbyproductid';
    const params = new HttpParams().append('productID', productId.toString());
    const headers = new HttpHeaders().append('page', '1').append('limit', '100000').append('usernamelogin', user);
    return this.http.get(url, {params, headers});
  }

  updatePrice(price: any): Observable<any> {
    const url = this.baseUrl + '/api/products/updateprice';
    return this.http.post(url, price);
  }

  deletePrice(price: any): Observable<any> {
    const url = this.baseUrl + '/api/products/deleteprice';
    return this.http.post(url, price);
  }

  getAllStores(): Observable<any> {
    const url = this.baseUrl + '/api/Stores/getAllStore';
    const headers = new HttpHeaders().append('page', '1').append('limit', '100000');
    return this.http.get(url, {headers});
  }
}
