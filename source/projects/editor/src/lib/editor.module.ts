import { NgModule } from '@angular/core';
import { EditorDirective } from './editor.directive';
import { ToolbarDirective } from './toolbar.directive';



@NgModule({
  declarations: [EditorDirective, ToolbarDirective],
  imports: [
  ],
  exports: [EditorDirective, ToolbarDirective]
})
export class EditorModule { }
