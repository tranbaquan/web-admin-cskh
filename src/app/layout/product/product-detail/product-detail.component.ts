import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {faCameraRetro} from '@fortawesome/free-solid-svg-icons';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  faCameraRetro = faCameraRetro;

  @ViewChild('fileUpload') fileUpload: ElementRef;
  file: File;
  fileBase64: string;

  constructor() {
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
}
