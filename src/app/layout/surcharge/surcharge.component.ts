import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Pagination} from '../../shared/model/pagination';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalService} from '../../shared/component/modal/modal.service';
import {faCameraRetro, faEdit, faPlus, faSearch, faSpinner, faTimesCircle, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {environment} from '../../../environments/environment';
import {FileUploadService} from '../product/product-detail/file-upload.service';
import {SurchargeResponseModel} from '../../shared/model/response/surcharge-response.model';
import {SurchargeService} from './surcharge.service';
import {ToastrService} from 'ngx-toastr';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-surcharge',
  templateUrl: './surcharge.component.html',
  styleUrls: ['./surcharge.component.scss']
})
export class SurchargeComponent implements OnInit {
  faPlus = faPlus;
  faSearch = faSearch;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;
  faCameraRetro = faCameraRetro;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  loading: boolean;
  searchQuery: string;
  page: number;
  size: number;
  surcharges: SurchargeResponseModel[];
  newSurcharge: SurchargeResponseModel;
  editingSurcharge: SurchargeResponseModel;
  pagination: Pagination<SurchargeResponseModel>;
  createSurchargeFormGroup: FormGroup;
  updateSurchargeFormGroup: FormGroup;
  user: any;

  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('updateFileUpload') updateFileUpload: ElementRef;

  constructor(private modalService: ModalService,
              private fileUploadService: FileUploadService,
              private toastService: ToastrService,
              private surchargeService: SurchargeService) {
    this.pagination = new Pagination<SurchargeResponseModel>();
    this.surcharges = [];
    this.page = 1;
    this.size = 50;
    this.searchQuery = '';
    this.user = JSON.parse(localStorage.getItem('user:info'));
    this.newSurcharge = new SurchargeResponseModel();
    this.editingSurcharge = new SurchargeResponseModel();
    this.initCreateForm();
  }

  ngOnInit(): void {
    this.getSurcharges();
  }

  getSurcharges(): void {
    this.loading = true;
    this.surchargeService.getSurcharges(this.page, this.size).subscribe(data => {
      this.pagination = data;
      this.surcharges = data.data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getSurcharges();
  }

  initCreateForm(): void {
    this.createSurchargeFormGroup = new FormGroup({
      SurchargeID: new FormControl(),
      CreatedDate: new FormControl(),
      Discount: new FormControl(0, [Validators.required]),
      IsAll: new FormControl(1),
      TimeEnd: new FormControl('', [Validators.required]),
      TimeStart: new FormControl('', [Validators.required]),
      Title: new FormControl('', [Validators.required]),
      UpdatedDate: new FormControl(0),
      Description: new FormControl(''),
      Status: new FormControl(1),
      UserCreated: new FormControl(this.user.UserCreated),
      UserUpdated: new FormControl(this.user.Code)
    });
  }

  initUpdateForm(): void {
    this.updateSurchargeFormGroup = new FormGroup({
      SurchargeID: new FormControl(this.editingSurcharge.SurchargeID),
      CreatedDate: new FormControl(this.editingSurcharge.CreatedDate),
      Discount: new FormControl(this.editingSurcharge.Discount, [Validators.required]),
      IsAll: new FormControl(this.editingSurcharge.IsAll),
      TimeEnd: new FormControl(this.editingSurcharge.TimeEnd, [Validators.required]),
      TimeStart: new FormControl(this.editingSurcharge.TimeStart, [Validators.required]),
      Title: new FormControl(this.editingSurcharge.Title, [Validators.required]),
      UpdatedDate: new FormControl(this.editingSurcharge.UpdatedDate),
      Description: new FormControl(this.editingSurcharge.Description),
      Status: new FormControl(this.editingSurcharge.Status),
      UserCreated: new FormControl(this.editingSurcharge.UserCreated),
      UserUpdated: new FormControl(this.user.Code)
    });
  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
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
        this.newSurcharge.ImagesPaths = data.data;
      } else {
        this.editingSurcharge.ImagesPaths = data.data;
      }
    });
  }

  removeImage(type: string): void {
    if (type === 'create') {
      this.newSurcharge.ImagesPaths = '';
    } else {
      this.editingSurcharge.ImagesPaths = '';
    }
  }

  getImageUrl(path: string): string {
    if (!path) {
      return '';
    }

    return environment.storageUrl + path?.substr(1);
  }

  openEditModal(surcharge: SurchargeResponseModel): void {
    this.editingSurcharge = surcharge;
    console.log(this.editingSurcharge);
    this.initUpdateForm();
    this.openModal('update-surcharge-modal');
  }

  deleteSurcharge(surcharge: SurchargeResponseModel): void {
    this.toastService.info('Đang xóa phụ thu', 'Xóa phụ thu', {timeOut: 3000});
    this.surchargeService.deleteSurcharge(surcharge.SurchargeID).subscribe(() => {
      this.toastService.success('Xóa phụ thu thành công', 'Xóa phụ thu', {timeOut: 3000});
    }, () => {
      this.toastService.error('Xóa phụ thu thất bại', 'Xóa phụ thu', {timeOut: 3000});
    }, () => {
      this.getSurcharges();
    });
  }


  createSurcharge(): void {
    Object.assign(this.newSurcharge, this.createSurchargeFormGroup.getRawValue());
    if (!this.newSurcharge.ImagesPaths) {
      this.newSurcharge.ImagesPaths = '';
    }
    this.closeModal('create-surcharge-modal');
    this.toastService.info('Đang tạo phụ thu', 'Tạo phụ thu', {timeOut: 3000});
    this.surchargeService.createSurcharge(this.newSurcharge).subscribe(() => {
      this.toastService.success('Tạo phụ thu thành công', 'Tạo phụ thu', {timeOut: 3000});
    }, () => {
      this.toastService.error('Tạo phụ thu thất bại', 'Tạo phụ thu', {timeOut: 3000});
    }, () => {
      this.getSurcharges();
      this.initCreateForm();
      this.newSurcharge = new SurchargeResponseModel();
    });
  }


  updateSurcharge(): void {
    Object.assign(this.editingSurcharge, this.updateSurchargeFormGroup.getRawValue());
    if (!this.editingSurcharge.ImagesPaths) {
      this.editingSurcharge.ImagesPaths = '';
    }
    this.closeModal('update-surcharge-modal');
    this.toastService.info('Đang cập nhật phụ thu', 'Cập nhật phụ thu', {timeOut: 3000});
    this.surchargeService.updateSurcharge(this.editingSurcharge).subscribe(() => {
      this.toastService.success('Cập nhật phụ thu thành công', 'Cập nhật phụ thu', {timeOut: 3000});
    }, () => {
      this.toastService.error('Cập nhật phụ thu thất bại', 'Cập nhật phụ thu', {timeOut: 3000});
    }, () => {
      this.getSurcharges();
      this.editingSurcharge = new SurchargeResponseModel();
    });
  }

  searchSurcharge(): void {
    this.loading = true;
    const params = new HttpParams().append('keySearch', this.searchQuery);

    this.surchargeService.getSurcharges(this.page, this.size, params).subscribe(data => {
      this.pagination = data;
      this.surcharges = data.data;
      if (this.pagination.totalItem > 0 && this.pagination.data.length === 0) {
        this.page = 1;
        this.surchargeService.getSurcharges(this.page, this.size, params).subscribe(newData => {
          this.pagination = newData;
          this.surcharges = newData.data;
        });
      }
    }, () => {
    }, () => {
      this.loading = false;
    });
  }


  isCreateValidField(field: string): boolean {
    return this.createSurchargeFormGroup.controls[field].valid;
  }

  isUpdateValidField(field: string): boolean {
    return this.updateSurchargeFormGroup.controls[field].valid;
  }

  getDate(date: Date): Date {
    return new Date(date);
  }

  updateDate($event: Event, field: string, type: string): void {
    const date = ($event.target as HTMLInputElement).valueAsDate;
    if (type === 'create') {
      this.newSurcharge[field] = date;
      this.createSurchargeFormGroup.controls[field].setValue(date);
    } else {
      this.editingSurcharge[field] = date;
      this.updateSurchargeFormGroup.controls[field].setValue(date);
    }
  }
}
