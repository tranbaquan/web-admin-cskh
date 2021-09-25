import {Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {ModalService} from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() backdropClose: boolean;
  @Input() width: number;
  @Input() contentTemplate: TemplateRef<any>;
  element: any;
  show: boolean;
  fade: boolean;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.backdropClose = false;
    this.show = false;
    this.fade = false;
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.id) {
      throw new Error('Modal must include id.');
    }

    document.body.appendChild(this.element);
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.close(this.id);
    this.modalService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    this.show = true;
    setTimeout(() => {
      this.fade = true;
    }, 10);
  }

  close(): void {
    this.fade = false;
    setTimeout(() => {
      this.show = false;
    }, 200);
  }
}
