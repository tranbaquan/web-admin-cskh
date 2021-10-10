import {Component, OnInit} from '@angular/core';
import {faEdit, faPlus, faSearch, faSpinner, faTimesCircle, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {ModalService} from '../../shared/component/modal/modal.service';
import {Pagination} from '../../shared/model/pagination';
import {StoreResponseModel} from '../../shared/model/response/store-response.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StoreService} from './store.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  faPlus = faPlus;
  faSearch = faSearch;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  loading: boolean;
  searchQuery: string;
  stores: StoreResponseModel[];
  pagination: Pagination<any>;
  page: number;
  size: number;
  createStoreFormGroup: FormGroup;
  updateStoreFormGroup: FormGroup;
  newStore: StoreResponseModel;
  editingStore: StoreResponseModel;
  user: any;

  constructor(private modalService: ModalService,
              private toastService: ToastrService,
              private storeService: StoreService) {
    this.pagination = new Pagination<any>();
    this.stores = [];
    this.page = 1;
    this.size = 50;
    this.searchQuery = '';
    this.newStore = new StoreResponseModel();
    this.editingStore = new StoreResponseModel();
    this.user = JSON.parse(localStorage.getItem('user:info'));
    this.initCreateForm();
  }

  ngOnInit(): void {
    this.getStores();
  }

  getStores(): void {
    this.loading = true;
    this.storeService.getStores(this.page, this.size).subscribe(data => {
      this.pagination = data;
      this.stores = data.data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  searchStore(): void {

  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  openEditModal(store: StoreResponseModel): void {
    this.editingStore = store;
    this.initUpdateForm();
    this.openModal('update-store-modal');
  }

  deleteStore(store: StoreResponseModel): void {
    this.toastService.info('Đang xóa kho', 'Xóa kho', {timeOut: 3000});
    this.storeService.deleteStore(store.StoreID).subscribe(() => {
      this.toastService.success('Xóa kho thành công', 'Xóa kho', {timeOut: 3000});
    }, () => {
      this.toastService.error('Xóa kho thất bại', 'Xóa kho', {timeOut: 3000});
    }, () => {
      this.getStores();
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getStores();
  }

  isCreateValidField(field: string): boolean {
    return this.createStoreFormGroup.controls[field].valid;
  }

  isUpdateValidField(field: string): boolean {
    return this.updateStoreFormGroup.controls[field].valid;
  }

  createStore(): void {
    Object.assign(this.newStore, this.createStoreFormGroup.getRawValue());
    this.newStore.UserCreated = this.user.UserCreated;
    this.newStore.UserUpdated = this.user.Code;
    this.closeModal('create-store-modal');
    this.toastService.info('Đang tạo kho', 'Tạo kho', {timeOut: 3000});
    this.storeService.createStore(this.newStore).subscribe(() => {
      this.toastService.success('Tạo kho thành công', 'Tạo kho', {timeOut: 3000});
    }, () => {
      this.toastService.error('Tạo kho thất bại', 'Tạo kho', {timeOut: 3000});
    }, () => {
      this.getStores();
      this.initCreateForm();
      this.newStore = new StoreResponseModel();
    });
  }

  updateStore(): void {
    Object.assign(this.editingStore, this.updateStoreFormGroup.getRawValue());
    this.editingStore.UserUpdated = this.user.Code;
    this.closeModal('update-store-modal');
    this.toastService.info('Đang cập nhật kho', 'Cập nhật kho', {timeOut: 3000});
    this.storeService.updateStore(this.editingStore).subscribe(() => {
      this.toastService.success('Cập nhật kho thành công', 'Cập nhật kho', {timeOut: 3000});
    }, () => {
      this.toastService.error('Cập nhật kho thất bại', 'Cập nhật kho', {timeOut: 3000});
    }, () => {
      this.getStores();
      this.editingStore = new StoreResponseModel();
    });
  }

  initCreateForm(): void {
    this.createStoreFormGroup = new FormGroup({
      Code: new FormControl('', [Validators.required]),
      StoreName: new FormControl('', [Validators.required]),
      Description: new FormControl('', [Validators.required]),
      Status: new FormControl(1, [Validators.required])
    });
  }

  initUpdateForm(): void {
    this.updateStoreFormGroup = new FormGroup({
      Code: new FormControl(this.editingStore.Code, [Validators.required]),
      StoreName: new FormControl(this.editingStore.StoreName, [Validators.required]),
      Description: new FormControl(this.editingStore.Description, [Validators.required]),
      Status: new FormControl(this.editingStore.Status, [Validators.required])
    });
  }
}
