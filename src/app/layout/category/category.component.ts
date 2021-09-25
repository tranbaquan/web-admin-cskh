import {Component, OnInit} from '@angular/core';
import {CategoryService} from './category.service';
import {CategoryResponseModel} from '../../shared/model/response/category-response.model';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: CategoryResponseModel[];

  constructor(private categoryService: CategoryService, private router: Router) {
    this.categories = [];
  }

  ngOnInit(): void {
    this.categoryService.getParentCategories().subscribe(data => {
      this.categories = data;
    });
  }

  getUrl(category: CategoryResponseModel): string {
    return environment.storageUrl + category.ImagesPath.substr(1);
  }


  redirectTo(path: string): void {
    this.router.navigate([path]).then(() => {
    });
  }
}
