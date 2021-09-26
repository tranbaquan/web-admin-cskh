import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() background: BackgroundType;

  constructor(private el: ElementRef) {
    this.background = 'bg-default';
    this.height = 32;
  }

  ngOnInit(): void {
    this.el.nativeElement.classList.add('core-button');
    this.el.nativeElement.classList.add(this.background);

    if (this.width) {
      this.el.nativeElement.style.width = this.width + 'px';
      this.el.nativeElement.style.height = this.height + 'px';
    }
  }

}

export type BackgroundType = 'bg-dark' | 'bg-default' | 'bg-transparent' | 'bg-orange' | 'bg-gray' | 'bg-red';
