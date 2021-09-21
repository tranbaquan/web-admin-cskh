import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ProductService} from '../product.service';
import {Injectable} from '@angular/core';
import {ProductResponseModel} from '../../../shared/model/response/product-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailResolver implements Resolve<any> {

  constructor(private productService: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductResponseModel> {
    const productId = route.paramMap.get('productId');
    return this.productService.getProductById(Number(productId));
  }

}

