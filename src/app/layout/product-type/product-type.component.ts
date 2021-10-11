import {Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {ProductTypeService} from './product-type.service';
import { isNil } from 'lodash';
import {TreeviewItem, TreeviewConfig, TreeviewI18n, DropdownTreeviewComponent, TreeviewHelper} from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';
import {ModalService} from '../../shared/component/modal/modal.service';
import {TypeProductModel} from '../../shared/model/type-product.model';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {TypeProductUpdateModel} from '../../shared/model/response/type-product-update.model';
import {environment} from '../../../environments/environment';
import {FileUploadService} from '../product/product-detail/file-upload.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss'],
  providers: [
    { provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }
  ]
})
export class ProductTypeComponent implements OnInit {

  @ViewChild(DropdownTreeviewComponent, { static: false }) dropdownTreeviewComponent: DropdownTreeviewComponent;

  filterText: string;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    maxHeight: 500
  });

  items: TreeviewItem[];
  isCreateNew = false;
  isChangeImg = false;
  imgToUpload: File;
  status = 100;

  user: any;
  typeProducts: TypeProductModel[] = [];
  typeProductsSort: TypeProductModel[] = [];
  selectedItem: TypeProductModel;
  faTimesCircle = faTimesCircle;

  constructor(private productTypeService: ProductTypeService,
              public i18n: TreeviewI18n,
              private fileUploadService: FileUploadService,
              private modalService: ModalService,
              private toastService: ToastrService) {
    this.user = JSON.parse(localStorage.getItem('user:info'));
  }

  ngOnInit(): void {
    this.getTypeProducts();
  }

  getTypeProducts(): void {
    this.productTypeService.getAllTypeProduct(1, 1000, '100')
      .subscribe(data => {
        const response = data.data;
        this.typeProducts = response.data;
        this.items = this.getTreeData(this.typeProducts);
        this.typeProductsSort = this.sort(this.typeProducts, null);
    });
  }

  select(item: TreeviewItem): void {
    this.selectedItem = this.findTypeProductById(item.value);
    this.modalService.open('detail-modal');
  }

  findTypeProductById(id: number): TypeProductModel {
    return this.typeProducts.find(item => item.TypeProductID === id);
  }

  closeModal(): void {
    this.modalService.close('detail-modal');
    this.selectedItem = new TypeProductModel();
    this.isCreateNew = false;
    this.isChangeImg = false;
    this.imgToUpload = null;
  }

  openCreateModal(): void {
    this.selectedItem = new TypeProductModel();
    this.isCreateNew = true;
    this.modalService.open('detail-modal');
  }

  sort(data: TypeProductModel[], parentId: number): TypeProductModel[] {
    const result = [];
    const level = 0;
    this.findChildren(parentId, data, level, result);
    return result;
  }

  findChildren(parentID: number, data: TypeProductModel[], level: number, result: TypeProductModel[]): void {
    const child = data.filter(item => item.ParentID === parentID);
    if (child.length === 0) {
      return;
    }
    for (const subchild of child) {
      subchild.level = level;
      result.push(subchild);
      this.findChildren(subchild.TypeProductID, data, level + 1, result);
    }
  }

  getTreeData(data: TypeProductModel[]): TreeviewItem[] {
    const result = [];
    this.findChildForTreeData(this.typeProducts, null, result);
    return result;
  }

  findChildForTreeData(data: TypeProductModel[], parentID: number, result: TreeviewItem[]): void {
    const child = data.filter(item => item.ParentID === parentID);
    if (child.length === 0) {
      return;
    }
    for (const subchild of child) {
      const listTemp = [];
      this.findChildForTreeData(data, subchild.TypeProductID, listTemp);
      const tmp = new TreeviewItem({
        text: subchild.NameType +  ' - ' + (subchild.Status === 1 ? 'Active' : 'Deactive'),
        value: subchild.TypeProductID,
        collapsed: true,
        children: listTemp
      });
      result.push(tmp);
    }
  }

  getLevelSpace(level: number): string {
    let result = '';
    for (let i = 0; i < level; i++) {
      result = result + '.....';
    }
    return result;
  }

  updateTypeProduct(): void {
    let imagePath = '';
    const formData = new FormData();
    formData.set('', this.imgToUpload);
    this.fileUploadService.updateImage(formData).subscribe(res => {
      console.log(res.data);
      imagePath = res.data;
    });

    setTimeout(() => {
      const modal = this.parseProductTypeUpdateModal(this.selectedItem);
      console.log('imagePath: ' + imagePath);
      if (imagePath) {
        modal.ImagesPath = imagePath;
      }
      this.productTypeService.updateTypeProduct(modal)
        .subscribe(data => {
          this.closeModal();
          window.location.reload();
        }, error => {
          this.toastService.warning(error.error.message, 'Cập nhật thất bại!');
        });
    }, 1000);
  }

  deleteTypeProduct(): void {
    this.productTypeService.deleteTypeProduct(this.selectedItem.TypeProductID)
      .subscribe(data => {
        this.closeModal();
        window.location.reload();
      },
        error => {
          this.toastService.warning(error.error.message, 'Xóa thất bại!');
        });
  }

  creatTypeProduct(): void {
    let imagePath = '';
    if (this.imgToUpload) {
      const formData = new FormData();
      formData.set('', this.imgToUpload);
      this.fileUploadService.updateImage(formData).subscribe(res => {
        imagePath = res.data;
      });
    }

    setTimeout(() => {
      const modal = this.parseProductTypeUpdateModal(this.selectedItem);
      if (imagePath) {
        modal.ImagesPath = imagePath;
      }
      this.productTypeService.createTypeProduct(modal)
        .subscribe(data => {
          this.closeModal();
          window.location.reload();
        }, error => {
          this.toastService.warning(error.error.message, 'Tạo thất bại!');
        });
    }, 1000);
  }

  parseProductTypeUpdateModal(data: TypeProductModel): TypeProductUpdateModel {
    const modal = new TypeProductUpdateModel();
    modal.TypeProductID = data.TypeProductID;
    modal.ParentID = data.ParentID;
    modal.Code = data.Code;
    modal.Description = data.Description;
    modal.NameType = data.NameType;
    modal.Order = data.Order;
    modal.Status = data.Status ? 1 : 0;
    modal.ImagesPath = data.ImagesPath;
    if (this.isCreateNew) {
      modal.UserCreated = this.user.Code;
      modal.UserUpdated = this.user.Code;
    } else {
      modal.UserCreated = data.UserCreated;
      modal.UserUpdated = data.UserUpdated;
    }
    return modal;
  }

  getImageUrl(path: string): string {
    return environment.storageUrl + path.substr(1);
  }

  changeImg(): void {
    this.isChangeImg = true;
  }

  skipChangeImg(): void {
    this.isChangeImg = false;
  }

  handleFileInput($event: Event): void {
    const files = ($event.target as HTMLInputElement)?.files;
    this.imgToUpload = files.item(0);
  }

  changeStatus(): void {
    console.log(this.status);
  }
}
