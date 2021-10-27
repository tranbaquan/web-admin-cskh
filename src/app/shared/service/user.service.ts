import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserModel} from '../model/user.model';
import {map} from 'rxjs/operators';
import {UserResponseModel} from '../model/response/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  login(user: UserModel): Observable<UserResponseModel> {
    const url = this.baseUrl + '/api/useradmin/login';
    return this.http.post(url, user).pipe(
      map((response: any) => {
        return Object.assign(new UserResponseModel(), response.data);
      })
    );
  }

  getListUser(page: number, limit: number, keySearch: string, typeUserID: string, status: string): Observable<any> {
    const url = this.baseUrl + '/api/useradmin/getuserSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    const params = new HttpParams()
      .set('typeUserID', typeUserID)
      .set('keySearch', keySearch)
      .set('status', status);
    return this.http.get(url, {headers, params});
  }

  createUser(user: UserResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/useradmin/create';
    return this.http.post(url, user);
  }

  updateUser(user: UserResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/useradmin/update';
    return this.http.post(url, user);
  }

  deleteUser(userId: number): Observable<any> {
    const url = this.baseUrl + '/api/useradmin/delete/' + userId;
    return this.http.delete(url);
  }
}
