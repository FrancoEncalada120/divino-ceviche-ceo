import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'txtsigno',
  standalone: true
})
export class TxtsignoPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: any, signo: string): string {
    if (value === null || value === undefined) {
      return '-';
    }

    let numericValue: number;

    if (typeof value === 'string') {
      // 🔥 Quitar SOLO el .000 final
      numericValue = Number(value.replace(/\.000$/, ''));
    } else {
      numericValue = value;
    }

    if (isNaN(numericValue)) {
      return '-';
    }

    const formatted = this.decimalPipe.transform(numericValue, '1.2-2');

    if (!formatted) {
      return '-';
    }

    if (signo === '$') {
      return `$ ${formatted}`;
    }

    if (signo === '%') {
      return `${formatted} %`;
    }

    return formatted;
  }
}
