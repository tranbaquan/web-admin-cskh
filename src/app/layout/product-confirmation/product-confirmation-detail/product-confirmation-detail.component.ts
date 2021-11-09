import {Component, OnInit} from '@angular/core';
import {ProductResponseModel, Specific} from '../../../shared/model/response/product-response.model';
import {Observable} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {Pagination} from '../../../shared/model/pagination';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../../shared/component/modal/modal.service';
import {FileUploadService} from '../../product/product-detail/file-upload.service';
import {ProductService} from '../../product/product.service';
import {map, startWith} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-product-confirmation-detail',
  templateUrl: './product-confirmation-detail.component.html',
  styleUrls: ['./product-confirmation-detail.component.scss']
})
export class ProductConfirmationDetailComponent implements OnInit {
  public Editor = ClassicEditor;
  product: ProductResponseModel;
  producers: any[];
  producersAsync: Observable<any[]>;
  productTypesAsync: Observable<any[]>;
  productTypes: any[];
  addSpecFormGroup: FormGroup;
  user: any;
  specParents: any[];
  pagination: Pagination<any>;
  currentPage: number;
  pageSize: number;
  stores: any[];
  producerFormControl: FormControl;
  productTypeFormControl: FormControl;
  category: string;
  imagePrefix = environment.storageUrl;
  techInfoList: { key: string, value: string }[];

  constructor(private route: ActivatedRoute,
              private modalService: ModalService,
              private fileUploadService: FileUploadService,
              private toastService: ToastrService,
              private router: Router,
              private productService: ProductService) {
    this.producerFormControl = new FormControl();
    this.productTypeFormControl = new FormControl();
    this.product = this.route.snapshot.data.product;
    this.producers = this.route.snapshot.data.producers;
    this.productTypes = this.route.snapshot.data.productTypes;
    this.initFormGroup();
    this.user = JSON.parse(localStorage.getItem('user:info'));
    this.currentPage = 1;
    this.pageSize = 50;
    this.stores = [];
    this.updatePagination();
    this.category = route.snapshot.queryParamMap.get('category');
    this.techInfoList = [];
  }

  ngOnInit(): void {
    this.productService.getAllStores().subscribe(response => {
      this.stores = response.data.data;
    });
    this.producersAsync = this.producerFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterProducer(value))
    );

    this.productTypesAsync = this.productTypeFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterProductType(value))
    );
    this.updateTechInfoList();
  }

  filterProducer(value: any): any[] {
    if (!value || typeof value !== 'string') {
      return this.producers;
    }
    const filterValue = value.toLowerCase();
    return this.producers.filter(producer => producer.NameProduction?.toLowerCase().includes(filterValue));
  }

  updateTechInfoList(): void {
    try {
      const array = JSON.parse(this.product.InformationTech);
      if (Array.isArray(array)) {
        this.techInfoList = array as any[];
      } else {
        this.techInfoList = [];
      }
    } catch (e) {
      this.techInfoList = [];
    }
  }

  filterProductType(value: string): any[] {
    if (!value || typeof value !== 'string') {
      return this.productTypes;
    }

    const filterValue = value.toLowerCase();
    return this.productTypes.filter(type => type.NameType?.toLowerCase().includes(filterValue));
  }

  updatePagination(): void {
    this.pagination = new Pagination<any>();
    this.pagination.totalItem = this.product.ListPrices.length;
    this.pagination.page = this.currentPage;
    this.pagination.size = this.pageSize;
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagination.data = this.product.ListPrices.slice(start, start + this.pageSize);
    this.pagination.totalPage = Math.ceil(this.pagination.totalItem / this.pageSize);
  }

  initFormGroup(): void {
    this.addSpecFormGroup = new FormGroup({
      Code: new FormControl({value: new Date().getTime(), disabled: true}),
      Description: new FormControl(),
      ParentID: new FormControl(),
      ProductID: new FormControl(),
      SpecID: new FormControl(),
      SpecName: new FormControl(),
      SpecParentID: new FormControl(),
      TypeSpec: new FormControl(),
      Status: new FormControl({value: 1, disabled: true}, [])
    });
  }

  trackByFn(index: number, value: any): any {
    return index;
  }

  getImageUrl(product: ProductResponseModel, index: number): string {
    return environment.storageUrl + product.ImagesPath[index]?.substr(1);
  }

  findSpecName(specs: Specific[], specId: number): string {
    return specs.find(spec => spec.SpecID === specId)?.SpecName;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  getStoreName(id: number): string {
    return this.stores.find(store => store.StoreID === id)?.StoreName;
  }

  getProductType(typeId: number): string {
    return this.productTypes.find(type => type.TypeProductID === typeId)?.NameType;
  }

  updateProductAmountSaleMulti($event: FocusEvent): void {
    this.product.AmountSaleMuilti = Number(($event.target as HTMLInputElement).value);
  }

  confirm(product: ProductResponseModel): void {
    product.Status = 1;
    this.toastService.info('Đang duyệt sản phẩm', 'Duyệt sản phẩm', {timeOut: 3000});
    this.productService.updateProduct(product).subscribe(() => {
      this.toastService.success('Duyệt sản phẩm thành công', 'Duyệt sản phẩm', {timeOut: 3000});
    }, () => {
      this.toastService.error('Duyệt sản phẩm thất bại', 'Duyệt sản phẩm', {timeOut: 3000});
    }, () => {
      this.router.navigate(['/product-confirmation']).then(() => {
      });
    });
  }
}
