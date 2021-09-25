import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {faCameraRetro, faPlus} from '@fortawesome/free-solid-svg-icons';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import {ActivatedRoute} from '@angular/router';
import {ProductResponseModel, Specific} from '../../../shared/model/response/product-response.model';
import {environment} from '../../../../environments/environment';
import {ModalService} from '../../../shared/component/modal/modal.service';
import {FileUploadService} from './file-upload.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  faCameraRetro = faCameraRetro;
  faPlus = faPlus;
  faTimesCircle = faTimesCircle;

  @ViewChild('fileUpload')
  fileUpload: ElementRef;
  file: File;
  fileBase64: string;

  product: ProductResponseModel;
  producers: any;
  productTypes: any;
  addSpecFormGroup: FormGroup;
  user: any;

  constructor(private route: ActivatedRoute,
              private modalService: ModalService,
              private fileUploadService: FileUploadService,
              private productService: ProductService) {
    this.product = this.route.snapshot.data.product;
    this.producers = this.route.snapshot.data.producers;
    this.productTypes = this.route.snapshot.data.productTypes;
    this.initFormGroup();
    this.user = JSON.parse(localStorage.getItem('user:info'));
    console.log(this.product);
    console.log(this.producers);
  }

  ngOnInit(): void {
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
      Status: new FormControl()
    });
  }


  openFileDialog(): void {
    this.fileUpload.nativeElement.click();
  }

  onFileSelected($event: Event): void {
    this.file = ($event.target as HTMLInputElement)?.files[0];

    const formData = new FormData();
    formData.append('', this.file);

    this.fileUploadService.updateImage(formData).subscribe(data => {
      console.log(data);
    });

    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.file);

    fileReader.onload = (e) => {
      console.log(e);
      console.log(fileReader.result);
      this.fileBase64 = fileReader.result as string;
      const progress = Math.round(100 * (e.loaded / e.total));
      console.log(progress);
    };
  }

  getUrl(product: ProductResponseModel): string {
    return environment.storageUrl + product.ImagesPath[0]?.substr(1);
  }

  findSpecName(specs: Specific[], specId: number): string {
    return specs.find(spec => spec.SpecID === specId)?.Code;
  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  saveChange(): void {
    const product = Object.assign({} as any, this.product);
    product.UserCreated = this.user.UserCreated;
    product.UserUpdated = this.user.Code;
    if (typeof this.product.ImagesPath === 'object') {
      product.ImagesPath = this.product.ImagesPath.join(',');
    }
    this.productService.updateProduct(product).subscribe(data => {
      console.log(data);
    });
  }

  addSpec(): void {
    this.closeModal('add-spec-modal');
    if (!this.product.ListSpec1 || this.product.ListSpec1.length === 0) {
      this.product.ListSpec1 = [this.addSpecFormGroup.value];
    } else if (!this.product.ListSpec2 || this.product.ListSpec2.length === 0) {
      this.product.ListSpec2 = [this.addSpecFormGroup.value];
    } else if (!this.product.ListSpec3 || this.product.ListSpec3.length === 0) {
      this.product.ListSpec3 = [this.addSpecFormGroup.value];
    }
  }
}
