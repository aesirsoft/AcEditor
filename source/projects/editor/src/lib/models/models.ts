import { EventEmitter, Output, Input, HostListener } from '@angular/core';
import { EventArgs } from '@asdm/ng-common';
import { ContextMenuItemBase } from './ContextMenuItemBase';
import { ToolbarButtonBase } from './ToolbarButtonBase';

export type EditorStatus = 'plaintext' | 'enable' | 'disable';

export type PluginType<T extends PluginBase = PluginBase> = new (editor: EditorBase) => T;

/** Plug-in base object types for the editor. */
export abstract class PluginBase {

    /** Get the identity name of the plug-in. */
    public abstract get Name(): string;

    constructor(protected readonly editor: EditorBase) { }

    public abstract GetToolbarButton(name: string): ToolbarButtonBase;

    /** Performs defined associated with freeing, releasing, or resetting resources. */
    public abstract Dispose(): void;
}

/** Editor abstract class. */
export abstract class EditorBase {

    private suspendStatus = false;
    /** Gets the suspend status. */
    protected get SuspendStatus() { return this.suspendStatus; }

    private isInitialized = false;
    public get IsInitialized() { return this.isInitialized; }


    protected readonly menu: HTMLDivElement;


    //#region public fields

    private plugins: PluginBase[] = [];
    /** Gets plug-in. */
    public get Plugins() { return this.plugins; }

    /** Gets or sets current editor's edit status. */
    public get Status(): EditorStatus | undefined {
        switch (this.box.contentEditable) {
            case 'true':
                return 'enable';

            case 'plaintext-only':
                return 'plaintext';

            default:
                return 'disable';
        }
    }
    @Input()
    public set Status(val: EditorStatus | undefined) {
        switch (val) {
            case 'enable':
                this.box.contentEditable = 'true';
                break;

            case 'plaintext':
                this.box.contentEditable = 'plaintext-only';
                break;

            // case 'disable':
            //     this.box.contentEditable = 'false';
            //     break;

            default:
                this.box.contentEditable = 'false';
                // this.box.attributes.removeNamedItem('contentEditable');
                break;
        }
    }

    /** Gets or sets the inner text value of the editor. */
    public get Text() { return this.box.innerText; }
    @Input()
    public set Text(val: string) {
        this.Suspend();
        this.box.innerText = val;
        this.Resume();
    }
    private textChange: EventEmitter<string> = new EventEmitter();
    @Output('TextChange')
    private get TextUpdate() { return this.textChange; }

    /** Gets or sets the inner html value of the editor. */
    public get Html() { return this.box.innerHTML; }
    @Input()
    public set Html(val: string) {
        this.Suspend();
        this.box.innerHTML = val; this.Resume();
    }
    private htmlChange: EventEmitter<string> = new EventEmitter();
    @Output('HtmlChange')
    private get HtmlUpdate() { return this.htmlChange; }

    /** Gets the document of the editor. */
    public get Document() { return this.box.ownerDocument || document; }

    //#endregion


    //#region events

    private readonly initialized: EventEmitter<EventArgs<this>> = new EventEmitter(true);
    @Output()
    public get Initialized() { return this.initialized; }

    private readonly contextMenuPending: EventEmitter<EventArgs<Node, ContextMenuItemBase[]>> = new EventEmitter();
    /** Context menus pending for events. */
    public get ContextMenuPending() { return this.contextMenuPending; }

    // private selectStart: EventEmitter<EventArgs<this>> = new EventEmitter(true);
    // public get SelectStart() { return this.selectStart; }

    private readonly clicked: EventEmitter<EventArgs<this>> = new EventEmitter(true);
    public get Clicked() { return this.clicked; }

    //#endregion


    //#region ctor init

    protected constructor(protected readonly box: HTMLElement) {
        this.menu = this.Document.createElement('div');
        this.initMenu();

        this.Suspend();
        this.initHtml();

        setTimeout(() => {
            new MutationObserver((mr) => {
                if (this.SuspendStatus) { return; }

                for (const r of mr) {
                    if (r.type !== 'childList') { continue; }
                    r.removedNodes.forEach(x => x.dispatchEvent(new Event('remove', { bubbles: false, cancelable: true })));
                }

                this.initHtml();
            }).observe(this.box, { subtree: true, childList: true });
        });

        this.Resume();
    }

    private initHtml() {
        if (this.box.innerHTML.trim().length === 0) {
            this.box.innerHTML = '<p><br></p>';
            setTimeout(() => {
                const p = this.box.querySelector('p');
                const s = this.Document.getSelection();
                if (!p || !s) {
                    this.box.blur();
                    return;
                }
                s.setBaseAndExtent(p, 0, p, 0);
            });
        }
    }

    /**
     * Initialize current editor.
     * @param pluginTypes Plug-in's types.
     */
    public init(...pluginTypes: PluginType[]) {
        this.isInitialized = false;
        this.plugins.forEach(x => x.Dispose());

        if (!pluginTypes) {
            this.plugins = [];
        } else {
            this.plugins = pluginTypes.map(x => new x(this));
        }
        this.initialized.emit(new EventArgs(this));
        this.isInitialized = true;
    }

    /** Update Editor changed content. */
    public updateChanged() {
        if (this.SuspendStatus) { return; }
        this.textChange.emit(this.Text);
        this.htmlChange.emit(this.Html);
    }

    //#endregion


    //#region clear content

    /** Empty the contents of the editor. */
    public clear() {
        this.Suspend();

        this.box.innerHTML = '';
        this.initHtml();

        this.Resume();
        this.updateChanged();
    }

    //#endregion


    //#region context menus

    private initMenu() {
        this.menu.contentEditable = 'false';
        this.menu.className = 'dropdown-menu d-block';
        this.menu.style.setProperty('width', '100px');
        this.menu.style.setProperty('height', '100px');
        this.menu.addEventListener('click', ev => {
            ev.stopPropagation();
            this.menu.innerHTML = '';
            this.menu.remove();
        });
    }

    private showMenu(ev: MouseEvent) {
        this.box.append(this.menu);
        setTimeout(() => {
            this.menu.style.top = `${ev.pageY}px`;
            if (ev.pageX + this.menu.offsetWidth > this.box.clientWidth) {
                this.menu.style.setProperty('left', 'auto');
                this.menu.style.setProperty('right', `${this.box.offsetWidth - this.box.clientWidth}px`);
            } else {
                this.menu.style.removeProperty('right');
                this.menu.style.left = `${ev.pageX}px`;
            }
        });
    }

    private readonly onContextMenu = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();

        let el: Node | null | undefined = ev.target as Node;
        const ms: ContextMenuItemBase[][] = [];
        while (el && el !== this.box) {
            const arg = new EventArgs<Node, ContextMenuItemBase[]>(el, []);
            this.contextMenuPending.emit(arg);
            if (arg.Arguments && arg.Arguments.length > 0) { ms.push(arg.Arguments); }

            el = el.parentElement;
        }

        if (ms.length > 0) { this.showMenu(ev); }
    }

    //#endregion


    //#region listens

    private Suspend() {
        this.suspendStatus = true;
        window.removeEventListener('mousedown', this.onWindowMousedown);
        this.box.removeEventListener('contextmenu', this.onContextMenu);
        this.box.removeEventListener('click', this.onClick);
    }
    private Resume() {
        window.addEventListener('mousedown', this.onWindowMousedown);
        this.box.addEventListener('contextmenu', this.onContextMenu);
        this.box.addEventListener('click', this.onClick);
        this.suspendStatus = false;
    }

    private readonly onWindowMousedown = (ev: MouseEvent) => {
        if (!ev.target
            || ev.target !== this.menu
            || !this.menu.contains(ev.target as Node)) {
            this.menu.innerHTML = '';
            this.menu.remove();
        }
    }

    private readonly onClick = (ev: MouseEvent) => {
        ev.stopPropagation();
        this.clicked.emit(new EventArgs(this));
    }

    @HostListener('blur', ['$event'])
    private EditorOnBlur(ev: Event) {
        ev.stopPropagation();
        this.updateChanged();
    }

    //#endregion


    /** Returns an object representing the current selection of the Editor that is loaded into the object displaying a webpage. */
    public getSelection(): Selection | undefined {
        const s = this.Document.getSelection();
        if (!s) { return undefined; }
        return this.box.contains(s.anchorNode) && this.box.contains(s.focusNode) ? s : undefined;
    }

    /**
     * Returns the first (starting at node) inclusive ancestor that matches selectors, and undefined otherwise.
     * @param node The specified node.
     * @param tagName node tag name.
     */
    public closest(node: Node, selector: string): Node | undefined {
        if (!node) { return undefined; }
        let el: Element;
        if (node.nodeType === 1) {
            el = node as Element;
        } else {
            el = node.parentElement;
        }

        if (!el) { return undefined; }
        el = el.closest(selector);
        return el && el !== this.box && this.box.contains(el) ? el : undefined;
    }

    /**
     * Executes commands for the current selection or given range in the current editor.
     * @param commandId
     * String that specifies the command to execute.
     * This command can be any of the command identifiers that can be executed in script.
     * @param value Value to assign.
     */
    public execCommand(commandId: string, value?: string): boolean {
        if (this.Status !== 'enable') { return; }

        const s = this.getSelection();
        if (!s || s.rangeCount < 1) { return false; }
        const rv = this.Document.execCommand(commandId, undefined, value);

        this.updateChanged();
        return rv;
    }
    /**
     * Inserts a node at the start of the Range.
     * @param node The Node to insert at the start of the range.
     */
    public insertNode(node: Node) {
        if (this.Status !== 'enable') { return; }

        const s = this.getSelection();
        if (!s || s.rangeCount < 1) { return false; }
        s.getRangeAt(0).insertNode(node);

        this.updateChanged();
    }

}
