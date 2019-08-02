import { ToolbarButton, EditorBase } from '@asdm/editor';
import { EventArgs } from '@asdm/ng-common';

export class CommandButtonBase extends ToolbarButton {

    public get Name(): string { return this.name; }

    constructor(
        protected readonly editor: EditorBase,
        protected readonly name: string,
        title: string,
        content: string) {
        super();

        if (title) { this.Title = title; }
        if (content) { this.InnerHTML = content; }
    }

    protected Click(): void {
        const s = this.editor.getSelection();
        if (!s) { return; }
        this.editor.execCommand(this.name);
    }
}


export class CommandRespondButtonBase extends CommandButtonBase {


    constructor(editor: EditorBase, name: string, protected readonly tagName: string, title: string, content: string) {
        super(editor, name, title, content);

        if (title) { this.Title = title; }
        if (content) { this.InnerHTML = content; }

        this.editor.Clicked.subscribe((x: EventArgs<EditorBase>) => {
            const s = x.Source.getSelection();
            if (!s || !s.focusNode) { return; }
            this.Checked = x.Source.closest(s.focusNode, this.tagName) !== undefined;
        });
    }

    protected Click(): void {
        const s = this.editor.getSelection();
        if (!s) { return; }
        this.editor.execCommand(this.name);
        if (s.focusNode) {
            this.Checked = this.editor.closest(s.focusNode, this.tagName) !== undefined;
        }
    }

    Dispose(): void {
        super.Dispose();

        this.editor.Clicked.unsubscribe();
    }
}

