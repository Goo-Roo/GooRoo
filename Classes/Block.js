import {Goo} from "./Goo.js";
import {Button} from "./Buttons.js";
import {app} from "../scripts/main.js";
import {ContentManager} from "./ContentManager.js";

const CROSS_ICON =
    '../resources/cross.svg#cross';
const DRAG_ICON =
    '../resources/drag.svg#drag';

function new_add_block_button() {
    return new Button
        .Builder('add-block-button'/*класс*/)
        .icon(CROSS_ICON, 16/*шир и выс*/)
        .size(16/*ширина*/, 16/*высота*/)
        .build();
}

function new_drag_block_button() {
    return new Button
        .Builder('drag-block-button'/*класс*/)
        .icon(DRAG_ICON, 16/*шир и выс*/)
        .size(16/*ширина*/, 16/*высота*/)
        .build();
}


class BlockContent extends Goo {
    #host;

    constructor(host) {
        super();
        const self = this;
        self.#host = host;
        self.classList.add('placeholder-soft');
        self.setAttribute('placeholder', "наберите '?' для команд");
        self.contentEditable = 'true';
        self.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        self.addEventListener('keydown', function (event) {
            host.register_me();
            host.keyDown(event);
        });
        self.addEventListener('mouseup', host.check_selection);
    }

    get host() {
        return this.#host;
    }
}

customElements.define('goo-block-content', BlockContent);

export class Block extends Goo {
    /**@type{Content}*/
    #host;
    /**@type{Goo}*/
    #content;
    /**@type{Button}*/
    add_block_button;
    /**@type{Button}*/
    drag_block_button;

    /**@param{Content}host*/
    constructor(host) {
        super();
        /**@type{Block}*/
        const self = this;
        self.host = host;
        self.#content = new BlockContent(self);
        self.add_block_button = new_add_block_button();
        self.drag_block_button = new_drag_block_button();
        self.add_block_button.addEventListener('click',
            function (event) {
                event.stopPropagation();
                self.host.current_block = self;
                self.host.new_block();
            });
        self.drag_block_button.addEventListener('click',
            function (event) {
                document
                    .getElementById('content-menu')
                    .set_invoker(self)
                    .show(event);
            });
        let control_panel = new Goo();
        control_panel.className = 'block-control-panel';
        control_panel.append(
            self.add_block_button,
            self.drag_block_button);
        self.append(
            control_panel,
            self.content);
    }
    clear(){
        ContentManager.clear_content(this);
    }
    /**@return {Content}*/
    get host() {
        return this.#host;
    }

    /**@param{Content}host*/
    set host(host) {
        this.#host = host;
    }

    /**@return {Goo}*/
    get content() {
        return this.#content;
    }

    /**@return {Block|Element}*/
    get previous() {
        return this.previousElementSibling;
    }

    /**@type{VoidFunction}*/
    focus() {
        this.#content.focus();
    }

    /**@return {boolean}*/
    get is_last() {
        return this === this.host.last_block;
    }

    /**@type{VoidFunction}
     * @param {MouseEvent}event
     */
    check_selection(event) {
        //если контент выделен показать меню форматирования контента
        if (selectionExist()) {
            let format_menu = document.getElementById('format-menu');
            app.range = document.getSelection().getRangeAt(0);
            /**@type {Range}*/
            format_menu.show(event);
        }
    }

    register_me() {
        this.host.current_block = this;
    }

    get is_alone() {
        return this.host.blocks.length < 2;
    }

    //обработать нажатие клавиши в поле блока
    /**
     * @param{KeyboardEvent}event
     */
    keyDown(event) {
        //если событие по умолчанию предотвращено, ПРЕДУПРЕЖДЕНИЕ
        if (event.defaultPrevented) alert("prevented");
        /**@type {Block}*/
        let self = this;

        function enter() {
            /**@type{DocumentFragment}*/
            let content;
            //  /*позиция каретки в контенте блока*/
            //  /**@type {Node}*/
            //  let startNode = getSelection().anchorNode;
            //  /**@type {number}*/
            //  let startOffset = getSelection().anchorOffset;
            //  /*конец контента в блоке*/
            //  let endNode = self.content.lastChild;
            //  /*если после каретки в блоке есть контент*/
            //  if (endNode) {
            //      let endOffset = endNode.textContent.length;
            //      /*создать диапазон*/
            //      let range = document.createRange();
            //      /*установить начало диапазона в позиции курсора*/
            //     range.setStart(startNode, startOffset);
            //     /*установить конец диапазона в конце контента элемента*/
            //     range.setEnd(endNode, endOffset);
            //     /*скопировать полученный диапазон в переменную*/
            content = ContentManager.content_after_caret;//range.cloneContents();
            /*удалить полученный диапазон из текущего элемента*/
            if (ContentManager.range_after_caret) {
                ContentManager.range_after_caret.deleteContents();
            }
            //}
            /*добавить новый блок с скопированным контентом*/
            self.host.new_block(content);
        }

        function backspace() {
            ContentManager.save_to_range('previous content', self.previous.content);
            /*добавить к контенту предыдущего блока контент текущего блока*/
            if (ContentManager.content_after_caret) {
                self.previous.content.append(ContentManager.content_after_caret);
            }
            /*удалить текущий блок*/
            self.remove();
            /**@type {Range}*//*диапазон для предыдущего блока*/
            let previousBlockRange = ContentManager.get_range('previous content');
            /*установить курсор перед добавленным в предыдущий блок контентом*/
            getSelection().setPosition(
                previousBlockRange.endContainer, previousBlockRange.endOffset);
        }

        switch (event.code) {
            //если нажата клавиша "Enter" обработать нажатие
            case "Enter":
                enter();
                event.preventDefault();
                break;
            case "Backspace":
                /**@type {Range}*/
                let range = document.createRange();
                /**@type{Selection}*/
                //  let selection = getSelection();
                // range.setStart(selection.anchorNode, 0);
                // range.setEnd(selection.focusNode, selection.focusOffset);
                range.selectNode(self.content);
                if (!ContentManager.range_before_caret.toString().length) {
                    if (!self.is_alone) {
                        backspace();
                        event.preventDefault();
                    }
                }
                break;
            case "ArrowUp":

                break;
            case 'ArrowDown':
                break;
        }
    }


}

/**@returns{boolean}*/
function selectionExist() {
    return !document.getSelection().isCollapsed;
}

