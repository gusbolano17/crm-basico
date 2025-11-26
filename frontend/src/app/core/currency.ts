import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { Directive, effect, ElementRef, forwardRef, inject, input } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import localeEsCO from '@angular/common/locales/es-CO';
import localeEsMX from '@angular/common/locales/es-MX';
import localePt from '@angular/common/locales/pt';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Registrar locales
registerLocaleData(localeEs);
registerLocaleData(localeEsCO);
registerLocaleData(localeEsMX);
registerLocaleData(localePt);

@Directive({
  selector: 'input[appCurrency]',
  standalone: true,
  providers: [
    CurrencyPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyDirective),
      multi: true,
    },
  ],
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
  },
})
export class CurrencyDirective implements ControlValueAccessor {

  private el = inject(ElementRef<HTMLInputElement>);
  private pipe = inject(CurrencyPipe);

  currency = input<string>('USD');
  locale = input<string>('en-US');

  private rawValue: number | null = null;
  private isFormatting = false;

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.rawValue = value;
    this.formatInputValue();
  }

  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * ⌨️ Formato en TIEMPO REAL sin perder cursor
   */
  onInput(event: Event) {
    if (this.isFormatting) return;

    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart ?? 0;

    const numericText = input.value
      .replace(/[^\d.,-]/g, '') // quita símbolos pero deja el decimal
      .replace(/\./g, '')       // quita miles
      .replace(',', '.');       // decimal -> punto

    let parsed = Number(numericText);
    if (isNaN(parsed)) parsed = 0;

    this.rawValue = parsed;
    this.onChange(parsed);

    // Volver a formatear mostrando la moneda
    this.formatInputValue(cursorPos);
  }

  /**
   * 🧮 Aplica formato currency en el input
   */
  private formatInputValue(previousCursor?: number) {
    const formatted = this.pipe.transform(
      this.rawValue ?? 0,
      this.currency(),
      'symbol',
      '1.2-2',
      this.locale()
    ) ?? '';

    this.isFormatting = true;

    const input = this.el.nativeElement;
    input.value = formatted;

    this.isFormatting = false;

    // Ajuste del cursor para evitar saltos molestos
    if (previousCursor != null) {
      const diff = input.value.length - previousCursor;
      const newPos = previousCursor + (diff > 0 ? 1 : 0);
      input.setSelectionRange(newPos, newPos);
    }
  }

  /**
   * 🫶 Al perder foco, formatea bien
   */
  onBlur() {
    this.formatInputValue();
    this.onTouched();
  }
}