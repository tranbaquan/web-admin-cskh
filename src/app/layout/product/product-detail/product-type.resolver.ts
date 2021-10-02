import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {CategoryService} from '../../category/category.service';
import {Observable} from 'rxjs';
import {CategoryResponseModel} from '../../../shared/model/response/category-response.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeResolver implements Resolve<CategoryResponseModel[]> {

  constructor(private categoryService: CategoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CategoryResponseModel[]> {
    const categoryId = route.queryParamMap.get('category');
    if (categoryId === 'all') {
      return this.categoryService.getAllCategories().pipe(
        map((data) => this.sort(data, null))
      );
    }
    return this.categoryService.getAllCategories().pipe(
      map((data) => this.sort(data, Number(categoryId)))
    );
  }

  sort(data: CategoryResponseModel[], categoryId: number): CategoryResponseModel[] {
    const result = [];
    const level = 0;
    this.findChildren(categoryId, data, level, result);
    return result;
  }

  findChildren(parentId: number, data: CategoryResponseModel[], level: number, result: CategoryResponseModel[]): void {
    const child = data.filter(datum => datum.ParentID === parentId);
    if (child.length === 0) {
      return;
    }
    for (const subChild of child) {
      subChild.level = level;
      result.push(subChild);
      this.findChildren(subChild.TypeProductID, data, level + 1, result);
    }
  }
}
