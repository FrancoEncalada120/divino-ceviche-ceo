import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'txtsigno'
})
export class TxtsignoPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) { }

  transform(
    value: number,
    signo: string
  ): string {

    if (value === null || value === undefined) {
      return '-';
    }

    const text = value.toString();

    const formatted = this.decimalPipe.transform(value, '1.2-2');

    if (!formatted) {
      return '-';
    }

    if (signo === '$') {
      return `$ ${formatted}`;
    }

    if (signo === '%') {
      return `${formatted} %`;
    }

    return text;
  }

}
