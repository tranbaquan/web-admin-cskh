import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ProductService} from '../product.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProducersResolver implements Resolve<any> {

  constructor(private productService: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.productService.getAllProducers();
  }

}

