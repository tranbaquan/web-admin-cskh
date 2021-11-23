import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pagination} from '../shared/model/pagination';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {NotificationResponseModel} from '../shared/model/response/notification-response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getNotifications(page: number, limit: number, params?: HttpParams): Observable<Pagination<NotificationResponseModel>> {
    const url = this.baseUrl + '/api/notification/getNotificationSearch';
    const headers = new HttpHeaders().append('page', page.toString()).append('limit', limit.toString());
    return this.http.get(url, {headers, params}).pipe(
      map((response: any) => {
        const data = response.data;
        const pagination = new Pagination<NotificationResponseModel>();
        console.log(data);
        pagination.totalItem = data.totals;
        pagination.page = page;
        pagination.size = limit;
        pagination.totalPage = Math.ceil(data.totals / limit);
        pagination.data = data.data.map(obj => Object.assign(new NotificationResponseModel(), obj));
        return pagination;
      })
    );
  }

  createNotification(notification: NotificationResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/notification/create';
    return this.http.post(url, notification);
  }


  updateNotification(notification: NotificationResponseModel): Observable<any> {
    const url = this.baseUrl + '/api/notification/update';
    return this.http.post(url, notification);
  }

  deleteNotification(notificationId: number): Observable<any> {
    const url = this.baseUrl + '/api/notification/Delete/' + notificationId;
    return this.http.delete(url);
  }

  createRealtimeNotification(topic: string, servicesId: number, title: string, content: string): Observable<any> {
    const url = this.baseUrl + '/api/messaging/sendnotificationfirebase';
    return this.http.post(url, {Topic: topic, ServicesID: servicesId, Title: title, Content: content});
  }
}
