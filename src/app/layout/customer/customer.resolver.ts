import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {ProductService} from '../product/product.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CustomerService} from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return undefined;
  }
}

@Injectable({
  providedIn: 'root'
})
export class StoreResolver implements Resolve<any[]> {

  constructor(private productService: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    return this.productService.getAllStores().pipe(
      map((response: any) => response.data.data)
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class CompanyResolver implements Resolve<any[]> {

  constructor(private customerService: CustomerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    return this.customerService.getAllCompanies().pipe(
      map((response: any) => response.data.data)
    );
  }
}
