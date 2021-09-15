import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
      map(data => {
        return Object.assign(new UserResponseModel(), data);
      })
    );
  }

}
