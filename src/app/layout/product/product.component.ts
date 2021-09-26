import {Component, OnInit} from '@angular/core';
import {faAngleLeft, faAngleRight, faSearch, faPlus, faBars, faTh, faStar, faSpinner} from '@fortawesome/free-solid-svg-icons';
import {faEye} from '@fortawesome/free-regular-svg-icons';
import {ProductService} from './product.service';
import {ProductResponseModel} from '../../shared/model/response/product-response.model';
import {environment} from '../../../environments/environment';
import {Pagination} from '../../shared/model/pagination';
import {CategoryService} from '../category/category.service';
import {CategoryResponseModel} from '../../shared/model/response/category-response.model';
import {HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faSearch = faSearch;
  faPlus = faPlus;
  faBars = faBars;
  faTh = faTh;
  faStar = faStar;
  faSpinner = faSpinner;
  faEye = faEye;

  currentCategory: CategoryResponseModel;
  display: ProductDisplay;
  page: number;
  size: number;
  searchQuery: string;
  products: ProductResponseModel[];
  categories: CategoryResponseModel[];
  pagination: Pagination<ProductResponseModel>;
  loading: boolean;

  constructor(private productService: ProductService, private categoryService: CategoryService, private router: Router) {
    const display = localStorage.getItem('product:display') as ProductDisplay;
    this.display = display ? display : 'grid';
    this.page = 1;
    this.size = 50;
    this.products = [];
    this.categories = [];
    this.searchQuery = '';
    this.pagination = new Pagination<ProductResponseModel>();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getParentCategories();
  }

  getProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.page, this.size).subscribe(data => {
      this.pagination = data;
      this.products = data.data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  searchProduct(query: string, categoryType: number): void {
    this.loading = true;
    let params = new HttpParams().append('keySearch', query);
    if (categoryType) {
      params = params.append('typeProductID', categoryType.toString());
    }
    this.productService.getProducts(this.page, this.size, params).subscribe(data => {
      this.pagination = data;
      this.products = data.data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  getUrl(product: ProductResponseModel): string {
    return environment.storageUrl + product.ImagesPath[0]?.substr(1);
  }

  onPageChange(page: number): void {
    this.page = page;
    this.searchProduct(this.searchQuery, this.currentCategory?.TypeProductID);
  }

  getParentCategories(): void {
    this.categoryService.getParentCategories().subscribe(data => {
      this.categories = data;
    });
  }

  updateCategory(category: CategoryResponseModel): void {
    this.currentCategory = category;
    this.categoryService.getCategoriesByParentId(this.currentCategory.TypeProductID).subscribe(data => {
      this.categories = data;
    });
    this.searchProduct('', category.TypeProductID);
  }

  viewDetail(product: ProductResponseModel): void {
    this.router.navigate(['product', product.ProductID]).then(() => {
    });
  }

  changeDisplay(display: ProductDisplay): void {
    this.display = display;
    localStorage.setItem('product:display', this.display);
  }

  createProduct(): void {
    this.router.navigate(['product', 'create']).then(() => {
    });
  }
}

export type ProductDisplay = 'grid' | 'list';
