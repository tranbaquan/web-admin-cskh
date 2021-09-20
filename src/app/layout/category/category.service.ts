import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {CategoryResponseModel} from '../../shared/model/response/category-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getParentCategories(): Observable<CategoryResponseModel[]> {
    const url = this.baseUrl + '/api/typeproduct/gettypeproductparent';
    return this.http.get(url).pipe(
      map((response: any) => response.data.map(data => Object.assign(new CategoryResponseModel(), data)))
    );
  }

  getCategoriesByParentId(parentId: number): Observable<CategoryResponseModel[]> {
    const url = this.baseUrl + '/api/typeproduct/gettypeproductbyparentid/' + parentId;
    return this.http.get(url).pipe(
      map((response: any) => response.data.map(data => Object.assign(new CategoryResponseModel(), data)))
    );
  }
}
