import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appSelect]'
})
export class SelectDirective implements OnInit {

  @Input() width: number;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.el.nativeElement.classList.add('core-select');
    if (this.width) {
      this.el.nativeElement.style.width = this.width + 'px';
    }
  }

}
