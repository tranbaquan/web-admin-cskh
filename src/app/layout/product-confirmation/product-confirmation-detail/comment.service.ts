import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Pagination} from '../../../shared/model/pagination';
import {ProductResponseModel} from '../../../shared/model/response/product-response.model';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {CommentModel} from '../../../shared/model/response/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getAllComments(productId: number, newID: number, status: number): Observable<any> {
    const url = this.baseUrl + '/api/cmscomment/getCMSCommentSearch';
    const headers = new HttpHeaders().append('page', '1').append('limit', '10000');
    const params = new HttpParams()
      .append('productId', productId.toString())
      .append('newID', newID.toString())
      .append('status', status.toString());
    return this.http.get(url, {headers, params}).pipe(
      map((res: any) => res.data.data.map(obj => Object.assign(new CommentModel(), obj)))
    );
  }

  getCommentById(id: any): Observable<any> {
    const url = this.baseUrl + '/api/cmscomment/getCMSCommentByID/' + id;
    return this.http.get(url);
  }

  createComment(comment: CommentModel): Observable<any> {
    const url = this.baseUrl + '/api/cmscomment/create';

    return this.http.post(url, comment);
  }


  updateComment(comment: CommentModel): Observable<any> {
    const url = this.baseUrl + '/api/cmscomment/update';

    return this.http.post(url, comment);
  }


  deleteComment(id: number): Observable<any> {
    const url = this.baseUrl + '/api/cmscomment/delete/' + id;
    return this.http.delete(url);
  }
}
