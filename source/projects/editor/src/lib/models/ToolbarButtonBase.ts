
/** The toolbar button object base type for the editor. */
export abstract class ToolbarButtonBase {

    /** Get the identity name of the toolbar button. */
    public abstract get Name(): string;

    /** Method to get a DOM HTML object of toolbar button. */
    public abstract GetElement(): HTMLButtonElement;
}

/** 工具栏标准按钮对象基础类型。 */
export abstract class ToolbarButton extends ToolbarButtonBase {
    private readonly btn: HTMLButtonElement;
    /** 设置提示文本。 */
    protected set Title(val: string) { this.btn.title = val; }
    /** 设置按钮文本或图标。 */
    protected set InnerHTML(val: string) { this.btn.innerHTML = val; }
    /** 获取按钮选中状态。 */
    protected get Checked() { return this.btn.classList.contains('active'); }
    /** 设置按钮选中状态。 */
    protected set Checked(val: boolean) {
        if (val === this.Checked) {
            return;
        }
        this.btn.classList.toggle('active');
    }
    protected constructor() {
        super();
        this.btn = document.createElement('button');
        this.btn.className = 'btn';
        this.InnerHTML = `<i class="far fa-grin-alt"></i>`;
        this.btn.onclick = () => this.Click();
    }
    public readonly GetElement = (): HTMLButtonElement => this.btn;
    /** 响应菜单项单击事件的方法。 */
    protected abstract Click(): void;
}
