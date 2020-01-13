import {Goo} from "./Goo.js";
import {Button} from "./Buttons.js";
import {app} from "../scripts/main.js";

const CROSS_ICON =
    '../resources/cross.svg#cross';
const DRAG_ICON =
    '../resources/drag.svg#drag';

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
        self.#content = new Goo();
        self.content.className = 'block-content';
        self.content.classList.add('placeholder-soft');
        self.content.setAttribute('placeholder', "наберите '?' для команд");
        self.content.contentEditable = 'true';
        self.content.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        self.content.addEventListener('keydown', function (event) {
            self.host.current_block = self;
            self.keyDown(event);
        });
        self.content.addEventListener('mouseup', this.check_selection);
        self.add_block_button =
            new Button.Builder('add-block-button'/*класс*/)
                .icon(CROSS_ICON, 16/*шир и выс*/)
                .size(16/*ширина*/, 16/*высота*/)
                .build();
        self.drag_block_button =
            new Button.Builder('drag-block-button'/*класс*/)
                .icon(DRAG_ICON, 16/*шир и выс*/)
                .size(16/*ширина*/, 16/*высота*/)
                .build();
        self.add_block_button.addEventListener('click', function (event) {
            event.stopPropagation();
            self.host.current_block = self;
            self.host.new_block();
        });
        self.drag_block_button.addEventListener('click', function (event) {
            document.getElementById('content-menu').show(event);
        });
        let control_panel = new Goo();
        control_panel.className = 'block-control-panel';
        control_panel
            .append(
                self.add_block_button,
                self.drag_block_button);
        self.append(
            control_panel,
            self.content);
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

    get is_alone(){
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
            /*позиция каретки в контенте блока*/
            /**@type {Node}*/
            let startNode = getSelection().anchorNode;
            /**@type {number}*/
            let startOffset = getSelection().anchorOffset;
            /*конец контента в блоке*/
            let endNode = self.content.lastChild;
            /*если после каретки в блоке есть контент*/
            if (endNode) {
                let endOffset = endNode.textContent.length;
                /*создать диапазон*/
                let range = document.createRange();
                /*установить начало диапазона в позиции курсора*/
                range.setStart(startNode, startOffset);
                /*установить конец диапазона в конце контента элемента*/
                range.setEnd(endNode, endOffset);
                /*скопировать полученный диапазон в переменную*/
                content = range.cloneContents();
                /*удалить полученный диапазон из текущего элемента*/
                range.deleteContents();
            }
            /*добавить новый блок с скопированным контентом*/
            self.host.new_block(content);
        }

        function backspace() {
            let previousBlockContent = self.previous.content;
            /**@type {Range} диапазон для текущего блока*/
            let currentBlockRange = document.createRange();
            //установить диапазон равным контенту текущего блока
            currentBlockRange.selectNodeContents(self.content);
            /**@type {Range} диапазон для предыдущего блока*/
            let previousBlockRange = document.createRange();
            //установить диапазон равным контенту предыдущего блока
            previousBlockRange.selectNodeContents(previousBlockContent);
            //добавить к контенту предыдущего блока контент текущего блока
            previousBlockContent.append(currentBlockRange.cloneContents());
            //удалить текущий блок
            self.remove();
            //установить курсор перед добавленным контентом
            getSelection().setPosition(previousBlockRange.endContainer, previousBlockRange.endOffset);
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
                let selection = getSelection();
                range.setStart(selection.anchorNode, 0);
                range.setEnd(selection.focusNode, selection.focusOffset);
                if (range.collapsed) {
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

