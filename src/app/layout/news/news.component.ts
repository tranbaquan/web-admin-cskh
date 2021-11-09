import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  faSearch,
  faSortDown,
  faEllipsisH,
  faSpinner,
  faTimesCircle,
  faWindowClose,
  faSave,
  faClone,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import {Pagination} from '../../shared/model/pagination';
import {NewResponseModel} from '../../shared/model/response/new-response.model';
import {NewService} from './new.service';
import {environment} from '../../../environments/environment';
import {TypeNewResponseModel} from '../../shared/model/response/type-new-response.model';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {ModalService} from '../../shared/component/modal/modal.service';
import {FileUploadService} from '../product/product-detail/file-upload.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CKEditor5} from '@ckeditor/ckeditor5-angular';
import {MyUploadAdapter} from '../product/product-detail/my-upload.adapter';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  public Editor = ClassicEditor;
  faSearch = faSearch;
  faSortDown = faSortDown;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;
  faPlus = faPlus;
  faWindowClose = faWindowClose;
  faSave = faSave;

  user: any;
  page: number;
  size: number;
  keySearch: string;
  pagination: Pagination<NewResponseModel>;
  isLoading = false;
  isUpdate = false;
  listTypeNew: TypeNewResponseModel[];
  type: number;
  status: number;
  isCreateNew = false;
  selectedItem: NewResponseModel;

  errorImage = '';
  errorTitle = '';
  errorType = '';
  errorShortDes = null;

  @ViewChild('fileUpload')
  fileUpload: ElementRef;

  constructor(private newService: NewService,
              private toastService: ToastrService,
              private modalService: ModalService,
              private fileUploadService: FileUploadService) {
    this.user = JSON.parse(localStorage.getItem('user:info'));
    this.pagination = new Pagination<NewResponseModel>();
    this.page = 1;
    this.size = 10;
    this.listTypeNew = [];
    this.status = 100;
    this.type = 1;
    this.keySearch = '';
    this.selectedItem = new NewResponseModel();
  }

  ngOnInit(): void {
    this.initData().then();
  }

  async initData(): Promise<any> {
    await this.getListTypeNew();
    this.searchNew();
  }

  getListTypeNew(): void {
    this.newService.getNewType(1, 1000)
      .subscribe(data => {
        this.listTypeNew = data.data.data.map(obj => Object.assign(new TypeNewResponseModel(), obj));
        this.type = this.listTypeNew[0].TypeNewsID;
      });
  }

  searchNew(): void {
    this.isLoading = true;
    this.newService.searchNews(this.page, this.size, this.keySearch, this.status.toString(), this.type.toString())
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        const pagination = new Pagination<NewResponseModel>();
        pagination.totalItem = data.data.totals;
        pagination.page = this.page;
        pagination.size = this.size;
        pagination.totalPage = Math.ceil(data.data.totals / this.size);
        pagination.data = data.data.data.map(obj => Object.assign(new NewResponseModel(), obj));
        this.pagination = pagination;
      }, error => {
        this.toastService.warning(error.error.message, 'Tải dữ liệu thất bại');
      });
  }

  createNew(): void {
    this.isUpdate = true;
    this.selectedItem.UserCreated = this.user.Code;
    this.selectedItem.UserUpdated = this.user.Code;
    this.selectedItem.TypeNewsID = Number(this.selectedItem.TypeNewsID);
    if (this.selectedItem.Status) {
      this.selectedItem.Status = 1;
    } else {
      this.selectedItem.Status = 0;
    }
    if (this.selectedItem.IsNew) {
      this.selectedItem.IsNew = 1;
    } else {
      this.selectedItem.IsNew = 0;
    }
    if (this.validate()) {
      this.selectedItem.Description1 = '';
      this.newService.createNew(this.selectedItem)
        .pipe(
          finalize(() => {
            this.isUpdate = false;
          })
        )
        .subscribe(data => {
          this.toastService.success('Tạo thành công!');
          this.closeModal();
          this.searchNew();
        }, error => {
          this.toastService.warning(error.error.message, 'Tạo thất bại');
        });
    }
  }

  deleteNew(newId: number): void {
    if (window.confirm('Xóa tin tức?')) {
      this.isUpdate = true;
      this.newService.deleteNew(newId)
        .pipe(
          finalize(() => {
            this.isUpdate = false;
          })
        )
        .subscribe(data => {
          this.toastService.success('Xóa thành công!');
          this.closeModal();
          this.searchNew();
        }, error => {
          this.toastService.warning(error.error.message, 'Xóa thất bại!');
        });
    }
  }

  updateNew(): void {
    this.selectedItem.UserUpdated = this.user.Code;
    this.selectedItem.TypeNewsID = Number(this.selectedItem.TypeNewsID);
    if (this.selectedItem.Status) {
      this.selectedItem.Status = 1;
    } else {
      this.selectedItem.Status = 0;
    }
    if (this.selectedItem.IsNew) {
      this.selectedItem.IsNew = 1;
    } else {
      this.selectedItem.IsNew = 0;
    }
    if (this.validate()) {
      this.isUpdate = true;
      this.newService.updateNew(this.selectedItem)
        .pipe(
          finalize(() => {
            this.isUpdate = false;
          })
        )
        .subscribe(data => {
          this.toastService.success('Cập nhật thành công.');
          this.closeModal();
          this.searchNew();
        }, error => {
          this.toastService.warning(error.error.message, 'Cập nhật thất bại!');
        });
    }
  }

  onPageChange(page: number): void {
    this.page = page;
    this.searchNew();
  }

  getImageUrl(path: string): string {
    return environment.storageUrl + path.substr(1);
  }

  closeModal(): void {
    this.modalService.close('new-modal');
    this.selectedItem = new NewResponseModel();
    this.isCreateNew = false;
    this.errorType = '';
    this.errorTitle = '';
    this.errorImage = '';
    this.errorShortDes = '';
  }

  openModal(): void {
    this.modalService.open('new-modal');
  }

  openModalUpdate(item: NewResponseModel): void {
    this.selectedItem = this.cloneNew(item);
    this.openModal();
  }

  openModalCreate(): void {
    this.isCreateNew = true;
    this.openModal();
  }

  openFileDialog(): void {
    this.fileUpload.nativeElement.click();
  }

  onFileSelected($event: Event): void {
    const files = ($event.target as HTMLInputElement)?.files;
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.set('', files.item(i));

      this.fileUploadService.updateImage(formData).subscribe(data => {
        this.selectedItem.ImagesPath = data.data;
        this.validateImage();
      });
    }
  }

  validateImage(): boolean {
    if (this.selectedItem.ImagesPath) {
      this.errorImage = '';
      return true;
    } else {
      this.errorImage = 'Chưa tải ảnh.';
      return false;
    }
  }

  validateTitle(): boolean {
    if (this.selectedItem.Title) {
      this.errorTitle = '';
      return true;
    } else {
      this.errorTitle = 'Chưa nhập title.';
      return false;
    }
  }

  validateType(): boolean {
    if (this.selectedItem.TypeNewsID) {
      this.errorType = '';
      return true;
    } else {
      this.errorType = 'Chưa chọn type.';
      return false;
    }
  }

  validateShortDes(): boolean {
    if (this.selectedItem.ShortDescription) {
      this.errorShortDes = '';
      return true;
    } else {
      this.errorShortDes = 'Chưa nhập mô tả.';
      return false;
    }
  }

  validate(): boolean {
    const title = this.validateTitle();
    const type = this.validateType();
    const img = this.validateImage();
    const shortDes = this.validateShortDes();
    return title && type && img && shortDes;
  }

  cloneNew(data: NewResponseModel): NewResponseModel {
    return Object.assign(new NewResponseModel(), data);
  }

  onReady($event: CKEditor5.Editor): void {
    $event.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, this.fileUploadService);
    };
  }
}
