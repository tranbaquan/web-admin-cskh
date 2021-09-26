import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Specific} from '../../../shared/model/response/product-response.model';

@Injectable({
  providedIn: 'root'
})
export class SpecificService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getSpecRelationship(parentId: number, childId: number): Observable<any> {
    const url = this.baseUrl + '/api/specspec/getSpecSpec';
    const params = new HttpParams().append('specParentID', parentId.toString())
      .append('specIDChild', childId.toString());
    return this.http.get(url, {params});
  }

  createSpec(specific: Specific): Observable<any> {
    const url = this.baseUrl + '/api/spec/create';
    return this.http.post(url, specific);
  }

  updateSpec(specific: Specific): Observable<any> {
    const url = this.baseUrl + '/api/spec/update';
    return this.http.post(url, specific);
  }

  deleteSpec(specId: number): Observable<any> {
    const url = this.baseUrl + '/api/spec/delete/' + specId;
    return this.http.delete(url);
  }

  createRelationship(parentId: number, childId: number): Observable<any> {
    const url = this.baseUrl + '/api/specspec/create';
    const data = {
      SpecSpecID: null,
      SpecParentID: parentId,
      SpecChildID: childId
    };

    return this.http.post(url, data);
  }

  deleteRelationship(parentId: number, childId: number): Observable<any> {
    const url = this.baseUrl + '/api/specspec/delete';
    const params = new HttpParams().append('specParentID', parentId.toString()).append('specChildID', childId.toString());
    return this.http.delete(url, {params});
  }
}
