import { Directive, ElementRef, forwardRef } from '@angular/core';
import { ToolbarBase } from './models/ToolbarBase';

@Directive({
  selector: '[acEditorToolbar], ac-editor-toolbar',
  providers: [
    { provide: ToolbarBase, useExisting: forwardRef(() => ToolbarDirective) }
  ],
  exportAs: 'acEditorToolbar'
})
export class ToolbarDirective extends ToolbarBase {

  constructor(el: ElementRef) { super(el.nativeElement); }

}
