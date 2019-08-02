import { Directive, ElementRef, forwardRef } from '@angular/core';
import { EditorBase } from './models/models';

@Directive({
  selector: '[acEditor], ac-editor',
  providers: [
    { provide: EditorBase, useExisting: forwardRef(() => EditorDirective) }
  ],
  exportAs: 'acEditor'
})
export class EditorDirective extends EditorBase {

  constructor(el: ElementRef) { super(el.nativeElement); }

}
