import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  subscribeToTopic(token: string, userId: number): Observable<any> {
    return this.http.post(this.baseUrl + '/api/messaging/subscribechannels', {MessagingToken: token, UserID: userId});
  }
}
