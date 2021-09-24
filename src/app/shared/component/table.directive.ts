import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appTable]'
})
export class TableDirective implements OnInit {

  @Input() isEvenSeparate: boolean;

  constructor(private el: ElementRef) {
    this.isEvenSeparate = false;
  }

  ngOnInit(): void {
    this.el.nativeElement.classList.add('core-table');
    if (this.isEvenSeparate) {
      this.el.nativeElement.classList.add('even-separate');
    }
  }
}
