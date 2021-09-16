import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective implements OnInit {
  @Input() width: number;
  @Input() background: BackgroundType = 'bg-default';

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.el.nativeElement.classList.add('core-button');
    this.el.nativeElement.classList.add(this.background);

    if (this.width) {
      this.el.nativeElement.style.width = this.width + 'px';
    }
  }

}

export type BackgroundType = 'bg-dark' | 'bg-default' | 'bg-transparent';
