import {Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {ProductTypeService} from './product-type.service';
import { isNil } from 'lodash';
import {TreeviewItem, TreeviewConfig, TreeviewI18n, DropdownTreeviewComponent, TreeviewHelper} from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';
import {ModalService} from '../../shared/component/modal/modal.service';
import {TypeProductModel} from '../../shared/model/type-product.model';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';


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

  typeProducts: TypeProductModel[] = [];
  typeProductsSort: TypeProductModel[] = [];
  selectedItem: TypeProductModel;
  faTimesCircle = faTimesCircle;

  constructor(private productTypeService: ProductTypeService,
              public i18n: TreeviewI18n,
              private modalService: ModalService) {
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
        text: subchild.NameType,
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
}
