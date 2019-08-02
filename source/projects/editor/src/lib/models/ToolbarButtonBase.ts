
/** The toolbar button object base type for the editor. */
export abstract class ToolbarButtonBase {

    /** Get the identity name of the toolbar button. */
    public abstract get Name(): string;

    /** Method to get a DOM HTML object of toolbar button. */
    public abstract GetElement(): HTMLButtonElement;

    /** Performs defined associated with freeing, releasing, or resetting resources. */
    public abstract Dispose(): void;
}

/** 工具栏标准按钮对象基础类型。 */
export abstract class ToolbarButton extends ToolbarButtonBase {

    /** The HTML tag object instance of the button. */
    protected readonly element: HTMLButtonElement;

    /** 设置提示文本。 */
    protected set Title(val: string) { this.element.title = val; }
    /** 设置按钮文本或图标。 */
    protected set InnerHTML(val: string) { this.element.innerHTML = val; }

    /** 获取按钮选中状态。 */
    protected get Checked() { return this.element.classList.contains('active'); }
    /** 设置按钮选中状态。 */
    protected set Checked(val: boolean) {
        if (val === this.Checked) {
            return;
        }
        this.element.classList.toggle('active');
    }

    protected constructor() {
        super();
        this.element = document.createElement('button');
        this.element.className = 'btn';
        this.InnerHTML = `<i class="far fa-grin-alt"></i>`;
        this.element.onclick = () => this.Click();
    }

    public readonly GetElement = (): HTMLButtonElement => this.element;

    /** 响应菜单项单击事件的方法。 */
    protected abstract Click(): void;

    Dispose() {
        this.element.remove();
    }
}
