import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Pagination} from '../../shared/model/pagination';
import {faCameraRetro, faPlus, faSearch, faSpinner, faTimesCircle, faTrashAlt, faEdit} from '@fortawesome/free-solid-svg-icons';
import {CustomerService} from './customer.service';
import {ModalService} from '../../shared/component/modal/modal.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerResponseModel} from '../../shared/model/response/customer-response.model';
import {ActivatedRoute} from '@angular/router';
import {FileUploadService} from '../product/product-detail/file-upload.service';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  faPlus = faPlus;
  faSearch = faSearch;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;
  faCameraRetro = faCameraRetro;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  loading: boolean;
  searchQuery: string;
  customers: CustomerResponseModel[];
  pagination: Pagination<any>;
  createCustomerFormGroup: FormGroup;
  updateCustomerFormGroup: FormGroup;
  page: number;
  size: number;
  stores: any[];
  companies: any[];
  newCustomer: CustomerResponseModel;
  editingCustomer: CustomerResponseModel;
  user: any;
  customerTypeSearch: number;

  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('updateFileUpload') updateFileUpload: ElementRef;

  constructor(private customerService: CustomerService,
              private route: ActivatedRoute,
              private toastService: ToastrService,
              private fileUploadService: FileUploadService,
              private modalService: ModalService) {
    this.pagination = new Pagination<any>();
    this.customers = [];
    this.page = 1;
    this.size = 50;
    this.searchQuery = '';
    this.customerTypeSearch = 0;
    this.newCustomer = new CustomerResponseModel();
    this.editingCustomer = new CustomerResponseModel();
    this.user = JSON.parse(localStorage.getItem('user:info'));
    this.initCreateForm();
    this.stores = this.route.snapshot.data.stores;
    this.companies = this.route.snapshot.data.companies;
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers(this.page, this.size).subscribe(data => {
      this.pagination = data;
      this.customers = data.data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getCustomers();
  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  getStoreName(id: number): string {
    return this.stores.find(store => store.StoreID === id)?.StoreName;
  }

  getCompanyName(id: number): string {
    return this.companies.find(store => store.CompanyID === id)?.CompanyName;
  }

  createCustomer(): void {
    Object.assign(this.newCustomer, this.createCustomerFormGroup.getRawValue());
    this.newCustomer.CompanyID = Number(this.newCustomer.CompanyID);
    this.newCustomer.StoreID = Number(this.newCustomer.StoreID);
    if (!this.newCustomer.Avatar) {
      this.newCustomer.Avatar = '';
    }
    this.closeModal('create-customer-modal');
    this.toastService.info('Đang tạo khách hàng', 'Tạo khách hàng', {timeOut: 3000});
    this.customerService.createCustomer(this.newCustomer).subscribe(() => {
      this.toastService.success('Tạo khách hàng thành công', 'Tạo khách hàng', {timeOut: 3000});
    }, () => {
      this.toastService.error('Tạo khách hàng thất bại', 'Tạo khách hàng', {timeOut: 3000});
    }, () => {
      this.getCustomers();
      this.initCreateForm();
      this.newCustomer = new CustomerResponseModel();
    });
  }


  openFileDialog(type: string): void {
    if (type === 'create') {
      this.fileUpload.nativeElement.click();
    } else {
      this.updateFileUpload.nativeElement.click();
    }
  }

  onFileSelected($event: Event, type: string): void {
    const file = ($event.target as HTMLInputElement)?.files[0];
    const formData = new FormData();
    formData.set('', file);
    this.fileUploadService.updateImage(formData).subscribe(data => {
      if (type === 'create') {
        this.newCustomer.Avatar = data.data;
      } else {
        this.editingCustomer.Avatar = data.data;
      }
    });
  }

  removeImage(type: string): void {
    if (type === 'create') {
      this.newCustomer.Avatar = '';
    } else {
      this.editingCustomer.Avatar = '';
    }
  }

  getImageUrl(path: string): string {
    return environment.storageUrl + path?.substr(1);
  }

  initCreateForm(): void {
    this.createCustomerFormGroup = new FormGroup({
      CustomerID: new FormControl(),
      CompanyID: new FormControl(),
      GroupCustomerID: new FormControl(),
      SaleID: new FormControl(),
      TypeCustomerID: new FormControl(1, [Validators.required]),
      StoreID: new FormControl(null, [Validators.required]),
      Code: new FormControl('', [Validators.required]),
      TaxCode: new FormControl(''),
      Password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]),
      NameCustomer: new FormControl('', [Validators.required]),
      VAT: new FormControl(0),
      Phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10,11}$/)]),
      Address: new FormControl(''),
      Description: new FormControl(''),
      Position: new FormControl(1),
      Birthday: new FormControl(),
      Status: new FormControl(1),
      UserCreated: new FormControl(this.user.UserCreated),
      UserUpdated: new FormControl(this.user.Code)
    });
  }

  initUpdateForm(): void {
    this.updateCustomerFormGroup = new FormGroup({
      CustomerID: new FormControl(this.editingCustomer.CustomerID),
      CompanyID: new FormControl(this.editingCustomer.CompanyID),
      GroupCustomerID: new FormControl(this.editingCustomer.GroupCustomerID),
      SaleID: new FormControl(this.editingCustomer.SaleID),
      TypeCustomerID: new FormControl(this.editingCustomer.TypeCustomerID, [Validators.required]),
      StoreID: new FormControl(this.editingCustomer.StoreID, [Validators.required]),
      Code: new FormControl(this.editingCustomer.Code, [Validators.required]),
      TaxCode: new FormControl(this.editingCustomer.TaxCode),
      Password: new FormControl(this.editingCustomer.Password, [Validators.required]),
      NameCustomer: new FormControl(this.editingCustomer.NameCustomer, [Validators.required]),
      VAT: new FormControl(this.editingCustomer.VAT),
      Phone: new FormControl(this.editingCustomer.Phone, [Validators.required]),
      Address: new FormControl(this.editingCustomer.Address),
      Description: new FormControl(this.editingCustomer.Description),
      Position: new FormControl(this.editingCustomer.Position),
      Birthday: new FormControl(this.editingCustomer.Birthday),
      Status: new FormControl(1),
      UserCreated: new FormControl(this.user.UserCreated),
      UserUpdated: new FormControl(this.user.Code)
    });
  }

  openEditModal(customer: CustomerResponseModel): void {
    this.editingCustomer = customer;
    this.initUpdateForm();
    this.openModal('update-customer-modal');
  }

  deleteCustomer(customer: CustomerResponseModel): void {
    this.toastService.info('Đang xóa khách hàng', 'Xóa khách hàng', {timeOut: 3000});
    this.customerService.deleteCustomer(customer.CustomerID).subscribe(() => {
      this.toastService.success('Xóa khách hàng thành công', 'Xóa khách hàng', {timeOut: 3000});
    }, () => {
      this.toastService.error('Xóa khách hàng thất bại', 'Xóa khách hàng', {timeOut: 3000});
    }, () => {
      this.getCustomers();
    });
  }

  updateCustomer(): void {
    Object.assign(this.editingCustomer, this.updateCustomerFormGroup.value);
    this.editingCustomer.CompanyID = Number(this.editingCustomer.CompanyID);
    this.editingCustomer.StoreID = Number(this.editingCustomer.StoreID);
    if (!this.editingCustomer.Avatar) {
      this.editingCustomer.Avatar = '';
    }
    this.closeModal('update-customer-modal');
    this.toastService.info('Đang cập nhật khách hàng', 'Cập nhật khách hàng', {timeOut: 3000});
    this.customerService.updateCustomer(this.editingCustomer).subscribe(() => {
      this.toastService.success('Cập nhật khách hàng thành công', 'Cập nhật khách hàng', {timeOut: 3000});
    }, () => {
      this.toastService.error('Cập nhật khách hàng thất bại', 'Cập nhật khách hàng', {timeOut: 3000});
    }, () => {
      this.getCustomers();
      this.editingCustomer = new CustomerResponseModel();
    });
  }

  searchCustomer(): void {
    this.loading = true;
    const params = new HttpParams().append('keySearch', this.searchQuery);

    this.customerService.getCustomers(this.page, this.size, params).subscribe(data => {
      this.pagination = data;
      this.customers = data.data;
      if (this.pagination.totalItem > 0 && this.pagination.data.length === 0) {
        this.page = 1;
        this.customerService.getCustomers(this.page, this.size, params).subscribe(newData => {
          this.pagination = newData;
          this.customers = newData.data;
        });
      }
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  searchCustomerByType(): void {

  }

  isCreateValidField(field: string): boolean {
    return this.createCustomerFormGroup.controls[field].valid;
  }

  isUpdateValidField(field: string): boolean {
    return this.updateCustomerFormGroup.controls[field].valid;
  }
}
