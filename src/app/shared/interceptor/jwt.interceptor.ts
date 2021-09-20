import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = req.headers;
    const basic = btoa('AdminMotolok:AdminMotolok');
    headers = headers.append('Authorization', 'Basic ' + basic);
    headers = headers.append('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    req = req.clone({
      headers
    });

    return next.handle(req);
  }

}
