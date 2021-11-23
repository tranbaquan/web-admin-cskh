import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CategoryResponseModel} from '../../shared/model/response/category-response.model';
import {ProductResponseModel} from '../../shared/model/response/product-response.model';
import {Pagination} from '../../shared/model/pagination';
import {ProductService} from '../product/product.service';
import {CategoryService} from '../category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {faBars, faPlus, faSearch, faSpinner, faStar, faTh} from '@fortawesome/free-solid-svg-icons';
import {faEye, faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import {ToastrService} from 'ngx-toastr';
import {NotificationService} from '../notification.service';
import {NotificationResponseModel} from '../../shared/model/response/notification-response.model';
import {UserResponseModel} from '../../shared/model/response/user-response.model';

@Component({
  selector: 'app-product-confirmation',
  templateUrl: './product-confirmation.component.html',
  styleUrls: ['./product-confirmation.component.scss']
})
export class ProductConfirmationComponent implements OnInit {
  faSearch = faSearch;
  faPlus = faPlus;
  faBars = faBars;
  faTh = faTh;
  faStar = faStar;
  faSpinner = faSpinner;
  faEye = faEye;
  faCheckCircle = faCheckCircle;

  currentCategory: CategoryResponseModel;
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
              private toastService: ToastrService,
              private notificationService: NotificationService,
              private router: Router) {
    this.page = 1;
    this.size = 50;
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
      this.searchConfirmationProducts();
    });
  }

  searchConfirmationProducts(): void {
    this.loading = true;
    const params = new HttpParams().append('Status', '0');
    this.productService.getProducts(this.page, this.size, this.user.UserID, params).subscribe(data => {
      this.pagination = data;
      this.products = data.data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  searchProduct(query: string, categoryType: number): void {
    this.loading = true;
    let params = new HttpParams().append('keySearch', query).append('Status', '0');
    if (categoryType) {
      params = params.append('typeProductID', categoryType.toString());
    }

    this.productService.getProducts(this.page, this.size, this.user.UserID, params).subscribe(data => {
      this.pagination = data;
      this.products = data.data;
      if (this.pagination.totalItem > 0 && this.pagination.data.length === 0) {
        this.page = 1;
        this.productService.getProducts(this.page, this.size, this.user.UserID, params).subscribe(newData => {
          this.pagination = newData;
          this.products = newData.data;
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

  viewDetail(product: ProductResponseModel): void {
    this.router.navigate(['product-confirmation', product.ProductID]).then(() => {
    });
  }

  confirm(product: ProductResponseModel): void {
    product.Status = 1;
    product.UserCreated = product.UserCreated.Code;
    const notification = new NotificationResponseModel();
    notification.Title = 'Sản phẩm được duyệt';
    notification.Message = 'Sản phẩm của bạn đã được duyệt bởi ' + this.user.Name;
    notification.IsRead = 0;
    notification.IsAll = 0;
    notification.NotificationID = 0;
    notification.Status = 1;
    notification.ID = 1;
    notification.TypeID = 1;
    notification.UserID = this.user.UserID;
    notification.UserCreated = this.user.Code;
    notification.UserUpdated = this.user.UserUpdated;
    this.toastService.info('Đang duyệt sản phẩm', 'Duyệt sản phẩm', {timeOut: 3000});
    this.productService.updateProduct(product).subscribe(() => {
      this.toastService.success('Duyệt sản phẩm thành công', 'Duyệt sản phẩm', {timeOut: 3000});
      this.notificationService.createRealtimeNotification('/topics/useradmin' + product.UserCreated.UserID, 0, 'Duyệt sản phẩm',
        this.user.Name + ' đã duyệt sản phẩm của bạn');
    }, () => {
      this.toastService.error('Duyệt sản phẩm thất bại', 'Duyệt sản phẩm', {timeOut: 3000});
    }, () => {
      this.searchConfirmationProducts();
    });
  }
}
