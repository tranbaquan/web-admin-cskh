import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {faCameraRetro, faEdit, faPlus, faSave, faTrash} from '@fortawesome/free-solid-svg-icons';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductResponseModel, Specific} from '../../../shared/model/response/product-response.model';
import {environment} from '../../../../environments/environment';
import {ModalService} from '../../../shared/component/modal/modal.service';
import {FileUploadService} from './file-upload.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ProductService} from '../product.service';
import {SpecificService} from './specific.service';
import {Pagination} from '../../../shared/model/pagination';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  faCameraRetro = faCameraRetro;
  faPlus = faPlus;
  faTimesCircle = faTimesCircle;
  faSave = faSave;
  faEdit = faEdit;
  faTrash = faTrash;

  @ViewChild('fileUpload')
  fileUpload: ElementRef;
  file: File;

  product: ProductResponseModel;
  producers: any[];
  producersAsync: Observable<any[]>;
  productTypesAsync: Observable<any[]>;
  productTypes: any[];
  addSpecFormGroup: FormGroup;
  user: any;
  editingSpecItem: Specific;
  editingSpecs: Specific[];
  specParents: any[];
  pagination: Pagination<any>;
  currentPage: number;
  pageSize: number;
  isCreated: boolean;
  newSpec1: string;
  newSpec2: string;
  newSpec3: string;
  stores: any[];
  techInfoLines: any[];
  techKey: string;
  techValue: string;
  producerFormControl: FormControl;
  productTypeFormControl: FormControl;


  constructor(private route: ActivatedRoute,
              private modalService: ModalService,
              private fileUploadService: FileUploadService,
              private productService: ProductService,
              private specService: SpecificService,
              private toast: ToastrService,
              private domSanitizer: DomSanitizer,
              private router: Router) {
    this.producerFormControl = new FormControl();
    this.productTypeFormControl = new FormControl();
    this.product = this.route.snapshot.data.product;
    this.validateProduct();
    this.producers = this.route.snapshot.data.producers;
    this.productTypes = this.route.snapshot.data.productTypes;
    this.initFormGroup();
    this.user = JSON.parse(localStorage.getItem('user:info'));
    this.currentPage = 1;
    this.pageSize = 50;
    this.stores = [];
    this.techInfoLines = [];
    this.updatePagination();
  }

  ngOnInit(): void {
    this.productService.getAllStores().subscribe(response => {
      this.stores = response.data.data;
    });
    this.producersAsync = this.producerFormControl.valueChanges.pipe(
      startWith(''),
      tap(value => {
        const obj = this.producers.find(producer => producer.Code === value);
        this.product.ListProduction = [obj];
        // TODO create if not found
        console.log(this.product.ListProduction);
      }),
      map(value => this.filterProducer(value))
    );

    this.productTypesAsync = this.productTypeFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterProductType(value))
    );
  }

  ngAfterViewInit(): void {
  }

  filterProducer(value: any): any[] {
    if (!value) {
      return this.producers;
    }
    const filterValue = value.toLowerCase();
    return this.producers.filter(producer => producer.Code?.toLowerCase().includes(filterValue));
  }

  //
  // toLowercase(value: string): string {
  //   return value.toLowerCase().replace(/\s/g, '');
  // }

  filterProductType(value: string): any[] {
    if (!value || typeof value !== 'string') {
      return this.productTypes;
    }

    const filterValue = value.toLowerCase();
    return this.productTypes.filter(type => type.NameType?.toLowerCase().includes(filterValue));
  }

  getProductInfo(): void {
    this.productService.getProductById(this.product.ProductID).subscribe(data => {
      this.product = data;
      this.updatePagination();
    });
  }

  trustHtml(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

  validateProduct(): void {
    if (!this.product) {
      this.isCreated = true;
      this.product = new ProductResponseModel();
    }
    this.producerFormControl.setValue(this.product.ListProduction[0]?.Code);
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
      Code: new FormControl(),
      Description: new FormControl(),
      ParentID: new FormControl(),
      ProductID: new FormControl(),
      SpecID: new FormControl(),
      SpecName: new FormControl(),
      SpecParentID: new FormControl(),
      TypeSpec: new FormControl(),
      Status: new FormControl(1, [])
    });
  }


  openFileDialog(): void {
    this.fileUpload.nativeElement.click();
  }

  onFileSelected($event: Event): void {
    this.file = ($event.target as HTMLInputElement)?.files[0];

    const formData = new FormData();
    formData.set('', this.file);

    this.fileUploadService.updateImage(formData).subscribe(data => {
      this.product.ImagesPath = [data.data];
    });
  }

  getUrl(product: ProductResponseModel): string {
    return environment.storageUrl + product.ImagesPath[0]?.substr(1);
  }

  findSpecName(specs: Specific[], specId: number): string {
    return specs.find(spec => spec.SpecID === specId)?.SpecName;
  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  saveChange(): void {
    this.toast.info('Đang cập nhật sản phẩm...', 'Cập nhật', {timeOut: 3000});
    const product = Object.assign({} as any, this.product);
    product.UserCreated = this.user.UserCreated;
    product.UserUpdated = this.user.Code;
    product.Status = this.product.Status ? 1 : 0;
    if (typeof this.product.ImagesPath === 'object') {
      product.ImagesPath = this.product.ImagesPath[0];
    }
    if (!product.ImagesPath) {
      product.ImagesPath = '';
    }

    this.productService.updateProduct(product).subscribe(() => {
      this.toast.clear();
      this.toast.success('Cập nhật thành công', 'Cập nhật', {timeOut: 3000});
      this.getProductInfo();
    });
  }

  techInfoToHtml(key: string, value: string): string {
    return `<tr><td>${key}</td><td>${value}</td></tr>`;
  }


  createProduct(): void {
    this.toast.info('Đang tạo sản phẩm...', 'Tạo sản phẩm', {timeOut: 3000});
    const product = Object.assign({} as any, this.product);
    product.UserCreated = this.user.UserCreated;
    product.UserUpdated = this.user.Code;
    product.Status = this.product.Status ? 1 : 0;
    product.FIFO = this.product.FIFO ? 1 : 0;
    if (typeof this.product.ImagesPath === 'object') {
      product.ImagesPath = this.product.ImagesPath[0];
    }
    this.productService.createProduct(product).subscribe(data => {
      this.toast.clear();
      this.toast.success('Tạo sản phẩm thành công', 'Tạo sản phẩm', {timeOut: 3000});
      this.router.navigate(['product', data.data.ProductID.toString()]).then(() => {
      });
    });
  }

  addSpec(): void {
    this.toast.info('Đang tạo đặc tả...', 'Tạo đặc tả', {timeOut: 3000});
    this.closeModal('add-spec-modal');
    const value = this.addSpecFormGroup.value;
    if (!this.product.ListSpec1 || this.product.ListSpec1.length === 0) {
      value.TypeSpec = 1;
      this.product.ListSpec1 = [value];
    } else if (!this.product.ListSpec2 || this.product.ListSpec2.length === 0) {
      value.TypeSpec = 2;
      this.product.ListSpec2 = [value];
    } else if (!this.product.ListSpec3 || this.product.ListSpec3.length === 0) {
      value.TypeSpec = 3;
      this.product.ListSpec3 = [value];
    }

    value.ProductID = this.product.ProductID;
    value.ParentID = 0;
    value.UserCreated = this.user.UserCreated;
    value.UserUpdated = this.user.Code;
    value.Status = Number(value.Status);
    value.SpecParentID = [];
    value.Description = '';

    this.specService.createSpec(value).subscribe(() => {
      this.addSpecFormGroup.reset();
      this.toast.clear();
      this.toast.success('Tạo đặc tả thành công', 'Tạo đặc tả', {timeOut: 3000});
      this.getProductInfo();
    });
  }

  openModalEditSpecItem(modalId: string, specItem: Specific, specs: Specific[], specParents: Specific[]): void {
    this.openModal(modalId);
    this.editingSpecItem = specItem;
    this.editingSpecs = specs;
    this.specParents = specParents.map(spec => Object.assign(new Specific(), spec));
  }

  idSpecCheck(spec: Specific, id: number): boolean {
    return spec.SpecParentID.includes(id);
  }

  updateSpecItem(): void {
    this.closeModal('edit-spec-item-modal');
    this.editingSpecItem.UserCreated = this.user.UserCreated;
    this.editingSpecItem.UserUpdated = this.user.Code;
    this.toast.info('Đang cập nhật lựa chọn...', 'Cập nhật lựa chọn', {timeOut: 3000});
    this.specService.updateSpec(this.editingSpecItem).subscribe(() => {
      this.getProductInfo();
      this.toast.clear();
      this.toast.success('Cập nhật lựa chọn thành công', 'Cập nhật lựa chọn', {timeOut: 3000});
    });
  }

  addSpecItem(): void {
    this.toast.info('Đang tạo lựa chọn...', 'Tạo lựa chọn', {timeOut: 3000});
    this.closeModal('add-spec-item-modal');
    const value = this.addSpecFormGroup.value;

    value.ProductID = this.product.ProductID;
    value.Status = Number(value.Status);
    value.SpecParentID = [];
    value.Description = '';
    value.SpecID = null;
    value.UserCreated = this.user.UserCreated;
    value.UserUpdated = this.user.Code;

    this.specService.createSpec(value).subscribe(() => {
      this.addSpecFormGroup.reset();
      this.productService.getPrices(this.product.ProductID, this.user.Code).subscribe(() => {
        this.toast.clear();
        this.toast.success('Tạo lựa chọn thành công', 'Tạo lựa chọn', {timeOut: 3000});
        this.getProductInfo();
      });
    });
  }

  openModalAddSpecItem(modalId: string, specParent: Specific): void {
    this.editingSpecItem = new Specific();
    this.initFormGroup();
    this.addSpecFormGroup.controls.ParentID.setValue(specParent.SpecID);
    this.addSpecFormGroup.controls.TypeSpec.setValue(specParent.TypeSpec);
    this.openModal(modalId);
  }

  deleteSpec(): void {
    this.toast.info('Đang xóa lựa chọn...', 'Xóa lựa chọn', {timeOut: 3000});
    this.closeModal('edit-spec-item-modal');
    this.specService.deleteSpec(this.editingSpecItem.SpecID).subscribe(() => {
      this.addSpecFormGroup.reset();
      this.toast.clear();
      this.toast.success('Xóa lựa chọn thành công', 'Xóa lựa chọn', {timeOut: 3000});
      this.getProductInfo();
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  savePrice(price: any): void {
    this.toast.info('Đang lưu giá...', 'Lưu giá', {timeOut: 3000});
    this.productService.updatePrice(price).subscribe(() => {
      this.toast.clear();
      this.toast.success('Lưu giá thành công', 'Lưu giá', {timeOut: 3000});
    });
  }

  deletePrice(price: any): void {
    this.toast.info('Đang xóa giá...', 'Xóa giá', {timeOut: 3000});
    this.productService.deletePrice(price).subscribe(() => {
      this.toast.clear();
      this.toast.success('Xóa giá thành công', 'Xóa giá', {timeOut: 3000});

      this.getProductInfo();
    });
  }

  specRelationshipChange($event: Event, childId: number, parentId: number): void {
    if (($event.target as HTMLInputElement).checked) {
      this.specService.createRelationship(parentId, childId).subscribe(() => {
      });
    } else {
      this.specService.deleteRelationship(parentId, childId).subscribe(() => {
      });
    }

  }

  addSpecItem1(specType: number, name: string, parentId: number): void {
    this.newSpec1 = '';
    this.newSpec2 = '';
    this.newSpec3 = '';
    const value = new Specific();
    value.ProductID = this.product.ProductID;
    value.Status = 1;
    value.ParentID = parentId;
    value.Code = name;
    value.SpecName = name;
    value.TypeSpec = specType;
    value.SpecParentID = [];
    value.Description = '';
    value.SpecID = null;
    value.UserCreated = this.user.UserCreated;
    value.UserUpdated = this.user.Code;

    this.specService.createSpec(value).subscribe(() => {
      this.productService.getPrices(this.product.ProductID, this.user.Code).subscribe(() => {
        this.getProductInfo();
        this.updatePagination();
      });
    });
  }

  getStoreName(id: number): string {
    return this.stores.find(store => store.StoreID === id)?.StoreName;
  }

  addTechInfoLine(): void {
    this.product.InformationTech = this.product.InformationTech + this.techInfoToHtml(this.techKey, this.techValue);
    this.techKey = '';
    this.techValue = '';
  }

  getProductType(typeId: number): string {
    return this.productTypes.find(type => type.TypeProductID === typeId)?.NameType;
  }

  productTypeSelected($event: MatAutocompleteSelectedEvent): void {
    this.product.TypeProductID = $event.option.value.TypeProductID;
    this.productTypeFormControl.reset();
  }
}
