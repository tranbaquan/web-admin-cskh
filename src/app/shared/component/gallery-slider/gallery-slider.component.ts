import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {faCameraRetro, faChevronLeft, faChevronRight, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {ProductResponseModel} from '../../model/response/product-response.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-gallery-slider',
  templateUrl: './gallery-slider.component.html',
  styleUrls: ['./gallery-slider.component.scss']
})
export class GallerySliderComponent implements OnInit, OnChanges {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCameraRetro = faCameraRetro;
  faTrashAlt = faTrashAlt;

  @Input() imagesUrl: string[];
  @Input() width: number;
  @Input() height: number;
  @Input() sliderHeight: number;
  @Input() imageSize: number;
  @Input() maxItem: number;
  @Input() urlPrefix: string;

  @Output() fileChange = new EventEmitter<{ file: File, index: number }>();
  @Output() imageRemove = new EventEmitter<number>();

  previewImage: string;
  currentActiveIndex: number;

  @ViewChild('slider') slider: ElementRef;
  @ViewChild('fileUpload') fileUpload: ElementRef;

  constructor() {
    this.imagesUrl = [];
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentActiveIndex > this.imagesUrl.length - 1) {
      this.currentActiveIndex = this.imagesUrl.length - 1;
    }
    if (this.currentActiveIndex < 0) {
      this.currentActiveIndex = 0;
    }
    this.previewImage = this.imagesUrl[this.currentActiveIndex];
  }

  init(): void {
    if (this.imagesUrl.length > 5) {
      this.previewImage = this.imagesUrl[2];
      this.currentActiveIndex = 2;
    } else {
      this.previewImage = this.imagesUrl[0];
      this.currentActiveIndex = 0;
    }
  }

  moveLeft(): void {
    const images = this.slider.nativeElement.querySelectorAll('.image');
    const firstItem = images.item(0);
    firstItem.style.marginLeft = -this.imageSize - 10 + 'px';
    if (this.currentActiveIndex < this.imagesUrl.length - 1) {
      this.currentActiveIndex++;
    } else {
      this.currentActiveIndex = 0;
    }
    this.previewImage = this.imagesUrl[this.currentActiveIndex];
    setTimeout(() => {
      firstItem.style.marginLeft = 0;
      this.slider.nativeElement.append(firstItem);
    }, 400);
  }

  moveRight(): void {
    const images = this.slider.nativeElement.querySelectorAll('.image');
    const lastItem = images.item(images.length - 1);
    lastItem.style.marginRight = -this.imageSize - 10 + 'px';
    this.slider.nativeElement.prepend(lastItem);
    if (this.currentActiveIndex > 0) {
      this.currentActiveIndex--;
    } else {
      this.currentActiveIndex = this.imagesUrl.length - 1;
    }
    this.previewImage = this.imagesUrl[this.currentActiveIndex];
    setTimeout(() => {
      lastItem.style.marginRight = 0;
    }, 0);
  }

  getImageUrl(relativePath): string {
    return this.urlPrefix + relativePath?.substr(1);
  }

  changePreviewImage(previewImage: string, index: number): void {
    this.previewImage = previewImage;
    this.currentActiveIndex = index;
  }

  openFileDialog(): void {
    this.fileUpload.nativeElement.click();
  }

  onFileSelected($event: Event): void {
    const file = ($event.target as HTMLInputElement)?.files[0];
    this.fileChange.emit({file, index: this.currentActiveIndex});
  }

  removeImage(): void {
    this.imageRemove.emit(this.currentActiveIndex);
  }
}
