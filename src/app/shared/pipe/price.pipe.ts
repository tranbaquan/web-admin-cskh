import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({name: 'price'})
export class PricePipe implements PipeTransform {

  constructor(private numberPipe: DecimalPipe) {
  }

  transform(value: any): string {
    return this.numberPipe.transform(Math.abs(value), '1.0');
  }
}
