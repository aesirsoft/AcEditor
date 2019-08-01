
/** The context menu item object base type for the editor. */
export abstract class ContextMenuItemBase {

    /** Method to get a DOM HTML object of context menu item. */
    public abstract GetElement(): HTMLElement;
}

/** 标准菜单项对象基础类型。 */
export abstract class ContextMenuItem extends ContextMenuItemBase {
    private readonly div: HTMLDivElement;
    private readonly span: HTMLSpanElement;
    private readonly icon: HTMLSpanElement;
    /** 设置菜单项文本。 */
    protected set Text(val: string) { this.span.innerText = val; }
    /** 设置菜单图标。 */
    protected set IconInnerHTML(val: string) { this.icon.innerHTML = val; }
    /** 获取或设置当前菜单响应的 DOM HTML 对象实例。 */
    public ResponseElement: HTMLElement;

    constructor() {
        super();
        this.div = document.createElement('div');
        this.div.className = 'dropdown-item';
        this.icon = document.createElement('span');
        this.icon.style.width = '16px';
        this.span = document.createElement('span');
        this.div.append(this.icon, this.span);
        this.div.onclick = () => this.Click();
    }

    public readonly GetElement = (): HTMLElement => this.div;

    /** 响应菜单项单击事件的方法。 */
    protected abstract Click(): void;
}
