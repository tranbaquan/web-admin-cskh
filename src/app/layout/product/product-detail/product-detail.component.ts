import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {faCameraRetro, faPlus} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';
import {ProductResponseModel, Specific} from '../../../shared/model/response/product-response.model';
import {environment} from '../../../../environments/environment';
import {ModalService} from '../../../shared/component/modal/modal.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  faCameraRetro = faCameraRetro;
  faPlus = faPlus;

  @ViewChild('fileUpload')
  fileUpload: ElementRef;
  file: File;
  fileBase64: string;

  product: ProductResponseModel;
  producers: any;
  productTypes: any;

  constructor(private route: ActivatedRoute, private modalService: ModalService) {
    this.product = this.route.snapshot.data.product;
    this.producers = this.route.snapshot.data.producers;
    this.productTypes = this.route.snapshot.data.productTypes;
    console.log(this.product);
    console.log(this.producers);
  }

  ngOnInit(): void {
  }

  openFileDialog(): void {
    this.fileUpload.nativeElement.click();
  }

  onFileSelected($event: Event): void {
    this.file = ($event.target as HTMLInputElement)?.files[0];

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
    console.log('hi');
    this.modalService.close(id);
  }
}
