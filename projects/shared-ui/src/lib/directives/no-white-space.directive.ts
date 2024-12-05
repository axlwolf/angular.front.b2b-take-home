/* eslint-disable @angular-eslint/no-host-metadata-property */
import { Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  standalone: true,
  selector: 'input[aplazoNoWhiteSpace]',
  host: {
    '(input)': 'sanitizeValue()',
  },
})
export class AplazoNoWhiteSpaceDirective {
  readonly #elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);
  readonly #ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  sanitizeValue(): void {
    const element = this.#elementRef.nativeElement;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const currentValue = element.value;

    const sanitizedValue = currentValue.replace(/\s/g, '');

    if (sanitizedValue !== currentValue) {
      element.value = sanitizedValue;

      if (this.#ngControl) {
        this.#ngControl.control?.setValue(sanitizedValue);
      }

      if (start !== null && end !== null) {
        // Adjust cursor position based on removed whitespace
        const diff = currentValue.length - sanitizedValue.length;
        const newStart = Math.max(0, start - diff); // Ensure it doesn't go below 0
        const newEnd = Math.max(0, end - diff);

        element.setSelectionRange(newStart, newEnd);
      }
    }
  }
}
