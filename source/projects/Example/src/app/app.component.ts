import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { EditorBase } from '@asdm/editor';
import { ClassicFormatPlugin } from '@asdm/editor-classic-format-plugin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  title = 'AcEditor Example';

  public readonly Btns: string[][];

  @ViewChild(EditorBase, { static: true })
  private editor: EditorBase;


  constructor() {
    this.Btns = [
      [
        ClassicFormatPlugin.Btns.bold, ClassicFormatPlugin.Btns.italic,
        ClassicFormatPlugin.Btns.underline,
        ClassicFormatPlugin.Btns.superscript, ClassicFormatPlugin.Btns.subscript
      ],
      [
        ClassicFormatPlugin.Btns.indent, ClassicFormatPlugin.Btns.outdent
      ]
    ];
  }

  ngAfterViewInit() {
    this.editor.init(ClassicFormatPlugin);
  }

}
