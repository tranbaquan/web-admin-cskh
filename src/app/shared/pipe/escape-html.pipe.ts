import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({name: 'escapeHtml', pure: false})
export class EscapeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
