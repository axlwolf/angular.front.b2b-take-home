/* eslint-disable @angular-eslint/no-host-metadata-property */
import { Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'input[aplazoLowercase]',
  host: {
    '(input)': 'sanitizeValue($event)',
  },
})
export class AplazoLowercaseDirective {
  readonly #elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);
  readonly #ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  sanitizeValue(event: InputEvent): void {
    const element = this.#elementRef.nativeElement;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const currentValue = element.value;

    const sanitizedValue = currentValue.toLowerCase();

    if (sanitizedValue !== currentValue) {
      element.value = sanitizedValue;

      if (this.#ngControl) {
        this.#ngControl.control?.setValue(sanitizedValue, { emitEvent: true }); // Important: emitEvent for reactivity
      }
      // Preserve cursor position
      if (start !== null && end !== null) {
        element.setSelectionRange(start, end);
      }
    }
  }
}
