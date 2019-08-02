import { EditorBase, PluginBase, ToolbarButtonBase } from '@asdm/editor';
import { CommandRespondButtonBase, CommandButtonBase } from './command-button-base';

const allowedButtons = [
    { name: 'bold', g: (x: EditorBase) => new CommandRespondButtonBase(x, 'bold', 'b', '粗体', `<i class="fa fa-bold"></i>`) },
    { name: 'italic', g: (x: EditorBase) => new CommandRespondButtonBase(x, 'italic', 'i', '斜体', `<i class="fa fa-italic"></i>`) },
    {
        name: 'underline',
        g: (x: EditorBase) => new CommandRespondButtonBase(x, 'underline', 'u', '下划线', `<i class="fa fa-underline"></i>`)
    },
    {
        name: 'strikeThrough',
        g: (x: EditorBase) => new CommandRespondButtonBase(x, 'strikeThrough', 'strike', '删除线', `<i class="fa fa-strikethrough"></i>`)
    },
    {
        name: 'superscript',
        g: (x: EditorBase) => new CommandRespondButtonBase(x, 'superscript', 'sup', '上标', `<i class="fa fa-superscript"></i>`)
    },
    {
        name: 'subscript',
        g: (x: EditorBase) => new CommandRespondButtonBase(x, 'subscript', 'sub', '下标', `<i class="fa fa-subscript"></i>`)
    },

    {
        name: 'indent',
        g: (x: EditorBase) => new CommandButtonBase(x, 'indent', '缩进', `<i class="fa fa-indent"></i>`)
    },
    {
        name: 'outdent',
        g: (x: EditorBase) => new CommandButtonBase(x, 'outdent', '减少缩进', `<i class="fa fa-outdent"></i>`)
    },



    {
        name: 'removeFormat',
        g: (x: EditorBase) => new CommandButtonBase(x, 'removeFormat', '去除所有格式', `<i class="fa fa-remove-format"></i>`)
    },

];

export class ClassicFormatPlugin extends PluginBase {

    public static readonly Btns = {
        bold: 'ClassicFormat.bold',
        italic: 'ClassicFormat.italic',
        underline: 'ClassicFormat.underline',
        strikeThrough: 'ClassicFormat.strikeThrough',
        superscript: 'ClassicFormat.superscript',
        subscript: 'ClassicFormat.subscript',
        indent: 'ClassicFormat.indent',
        outdent: 'ClassicFormat.outdent',
        removeFormat: 'ClassicFormat.removeFormat'
    };

    private btns: ToolbarButtonBase[] = [];


    public get Name(): string { return 'ClassicFormat'; }

    GetToolbarButton(name: string): ToolbarButtonBase {
        const t = allowedButtons.find(x => x.name === name);
        if (!t) { throw new Error(`Cannot found the button '${name}'.`); }

        let b = this.btns.find(x => x.Name === name);
        if (!b) {
            b = t.g(this.editor);
            this.btns.push(b);
        }
        return b;
    }

    Dispose(): void {
        this.btns.forEach(x => x.Dispose());
        this.btns = [];
    }

}
