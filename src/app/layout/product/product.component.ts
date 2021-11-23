import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {faAngleLeft, faAngleRight, faBars, faPlus, faSearch, faSpinner, faStar, faTh} from '@fortawesome/free-solid-svg-icons';
import {faEye} from '@fortawesome/free-regular-svg-icons';
import {ProductService} from './product.service';
import {ProductResponseModel} from '../../shared/model/response/product-response.model';
import {environment} from '../../../environments/environment';
import {Pagination} from '../../shared/model/pagination';
import {CategoryService} from '../category/category.service';
import {CategoryResponseModel} from '../../shared/model/response/category-response.model';
import {HttpParams} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {UserResponseModel} from '../../shared/model/response/user-response.model';

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
  user: UserResponseModel;

  @ViewChild('categorySlider') categorySlider: ElementRef;

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router) {
    const display = localStorage.getItem('product:display') as ProductDisplay;
    this.display = display ? display : 'grid';
    this.page = 1;
    this.size = 48;
    this.products = [];
    this.categories = [];
    this.searchQuery = '';
    this.pagination = new Pagination<ProductResponseModel>();
    const user = localStorage.getItem('user:info');
    if (user) {
      this.user = Object.assign(new UserResponseModel(), JSON.parse(user));
    } else {
      this.router.navigate(['login']).then(() => {
      });
    }

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.page) {
        this.page = Number(params.page);
      }
      this.init(params.category);
    });
  }

  init(parentCategory: string): void {
    if (parentCategory === 'all') {
      this.currentCategory = null;
      this.getProducts();
      this.getParentCategories();
    } else {
      this.categoryService.getCategoryById(Number(parentCategory)).subscribe(data => {
        this.currentCategory = data;
        this.updateCategory(this.currentCategory);
      });
    }
  }

  getProducts(): void {
    this.loading = true;
    const params = new HttpParams().append('Status', '1');
    this.productService.getProducts(this.page, this.size, this.user.UserID, params).subscribe(data => {
      this.pagination = data;
      this.products = data.data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  backToParent(): void {
    const parentCategory = this.currentCategory.ParentID ? this.currentCategory.ParentID + '' : 'all';
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        category: parentCategory,
        page: this.page + ''
      }
    }).then(() => {
      this.init(parentCategory);
    });
  }

  searchProduct(query: string, categoryType: number): void {
    this.loading = true;
    let params = new HttpParams().append('keySearch', query).append('Status', '1');
    if (categoryType) {
      params = params.append('typeProductID', categoryType.toString());
    }

    this.productService.getProducts(this.page, this.size, this.user.UserID, params).subscribe(data => {
      this.pagination = data;
      this.products = data.data;
      if (this.pagination.totalItem > 0 && this.pagination.data.length === 0) {
        this.page = 1;
        this.router.navigate(['./'], {
          relativeTo: this.route,
          queryParams: {
            category: this.currentCategory ? this.currentCategory.TypeProductID : 'all',
            page: 1
          }
        });
      }
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  getUrl(product: ProductResponseModel): string {
    return environment.storageUrl + product.ImagesPath[0]?.substr(1);
  }

  onPageChange(page: number): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        category: this.currentCategory ? this.currentCategory.TypeProductID : 'all',
        page: page + ''
      }
    });
    this.page = page;
    this.searchProduct(this.searchQuery, this.currentCategory?.TypeProductID);
  }

  getParentCategories(): void {
    this.categoryService.getParentCategories().subscribe(data => {
      this.categories = data;
    });
  }

  updateCategory(category: CategoryResponseModel): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        category: category.TypeProductID,
        page: this.page + ''
      }
    }).then(() => {
      this.currentCategory = category;
      this.categoryService.getCategoriesByParentId(this.currentCategory.TypeProductID).subscribe(data => {
        this.categories = data;
      });
      this.searchProduct('', category.TypeProductID);
    });
  }

  viewDetail(product: ProductResponseModel): void {
    this.router.navigate(['product', product.ProductID], {
      queryParams: {category: this.currentCategory ? this.currentCategory.TypeProductID : 'all'},
      queryParamsHandling: 'preserve'
    }).then(() => {
    });
  }

  changeDisplay(display: ProductDisplay): void {
    this.display = display;
    localStorage.setItem('product:display', this.display);
  }

  createProduct(): void {
    this.router.navigate(['product', 'create'], {
      queryParams: {category: this.currentCategory ? this.currentCategory.TypeProductID : 'all'}
    }).then(() => {
    });
  }

  scrollLeft(): void {
    const slider = this.categorySlider.nativeElement as HTMLElement;
    const newPoint = slider.scrollLeft - 200;
    if (newPoint < 0) {
      slider.scrollTo({left: 0, behavior: 'smooth'});
    } else {
      slider.scrollTo({left: newPoint, behavior: 'smooth'});
    }
  }

  scrollRight(): void {
    const slider = this.categorySlider.nativeElement as HTMLElement;
    const newPoint = slider.scrollLeft + 200;
    if (newPoint > slider.scrollWidth) {
      slider.scrollTo({left: slider.scrollWidth, behavior: 'smooth'});
    } else {
      slider.scrollTo({left: newPoint, behavior: 'smooth'});
    }
  }
}

export type ProductDisplay = 'grid' | 'list';
