import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  updateImage(formData: FormData): Observable<any> {
    const url = this.baseUrl + '/api/fileupload/upload';
    const headers = {};
    return this.http.post(url, formData, {headers});
  }

}
