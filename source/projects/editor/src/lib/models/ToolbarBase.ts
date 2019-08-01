import { AfterViewInit, Input } from '@angular/core';
import { EditorBase } from './models';
import { ToolbarButtonBase } from './ToolbarButtonBase';

/** Editor's toolbar abstract class. */
export abstract class ToolbarBase implements AfterViewInit {
    @Input()
    public Buttons: string[][] = [];
    @Input()
    private editor: EditorBase;
    public get Editor() { return this.editor; }
    protected constructor(protected readonly element: Element) { }
    ngAfterViewInit() {
        this.editor.Initialized.subscribe(() => this.init());
        if (this.editor.IsInitialized) {
            this.init();
        }
    }
    private init() {
        this.element.innerHTML = '';
        if (!this.Buttons) {
            return;
        }
        for (const g of this.Buttons) {
            if (!g || g.length === 0) {
                continue;
            }
            const bs: ToolbarButtonBase[] = [];
            for (const b of g) {
                if (!b || b.length < 3 || b.indexOf('.') < 1) {
                    continue;
                }
                const k = b.split('.');
                if (k.length !== 2) {
                    continue;
                }
                const p = this.editor.Plugins.find(x => x.Name === k[0]);
                if (!p) {
                    continue;
                }
                bs.push(p.GetToolbarButton(k[1]));
            }
            if (bs.length > 0) {
                const gEl = document.createElement('div');
                gEl.className = 'btn-group';
                if (this.element.children.length > 0) {
                    gEl.classList.add('ml-1');
                }
                gEl.append(...bs.map(x => {
                    const btn = x.GetElement();
                    btn.classList.add('btn-light');
                    return btn;
                }));
                this.element.appendChild(gEl);
            }
        }
    }
}
