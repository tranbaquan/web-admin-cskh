import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {CategoryService} from '../../category/category.service';
import {Observable} from 'rxjs';
import {CategoryResponseModel} from '../../../shared/model/response/category-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeResolver implements Resolve<CategoryResponseModel[]> {

  constructor(private categoryService: CategoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CategoryResponseModel[]> {
    return this.categoryService.getAllCategories();
  }
}
