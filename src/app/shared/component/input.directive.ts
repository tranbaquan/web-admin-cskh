import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appInput]'
})
export class InputDirective implements OnInit {
  @Input() width: number;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.el.nativeElement.classList.add('core-input');
    if (this.width) {
      this.el.nativeElement.style.width = this.width + 'px';
    }
  }

}
