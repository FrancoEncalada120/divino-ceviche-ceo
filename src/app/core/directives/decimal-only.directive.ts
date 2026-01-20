import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[decimalOnly]'
})
export class DecimalOnlyDirective {

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Solo números y un punto
    value = value
      .replace(/[^0-9.]/g, '')       // quita letras
      .replace(/(\..*)\./g, '$1');   // permite solo un punto

    input.value = value;
  }
}
