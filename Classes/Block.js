import {Goo} from "./Goo.js";
import {Button} from "./Buttons.js";
import {app} from "../scripts/main.js";
import {ContentManager} from "./ContentManager.js";
import {BlockContent} from "./BlockContent.js";
import {generateId} from "./functions.js";

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


customElements.define('goo-block-content', BlockContent);

export class Block extends Goo {
    /**@type{Goo}*/
    #content;
    /**@type{Button}*/
    add_block_button;
    /**@type{Button}*/
    drag_block_button;
    /*/--модель блока для хранения в БД--/*/
    #db_model = {
        id: undefined,
        order: undefined,
        page: undefined,
        content: undefined
    };

    constructor(id) {
        console.log('creating new block...');
        super();
        /**@type{Block}*/
        const self = this;
        /*/--если ID задан--/*/
        if (id) {
            /*/--присвоить блоку заданный ID--/*/
            self.id = id;
        } else {/*/--иначе--/*/
            /*/--присвоить блоку новый ID--/*/
            let random = generateId();
            self.id = random[0] + '-' + random[1] + '-' + random[2];
        }
        let control_panel = new Goo();
        self.#content = new BlockContent(self);
        self.add_block_button = new_add_block_button();
        self.drag_block_button = new_drag_block_button();
        control_panel.className = 'block-control-panel';
        control_panel.append(
            self.add_block_button,
            self.drag_block_button);
        self.append(
            control_panel,
            self.content);
        self.add_block_button.addEventListener('click',
            function (event) {
                self.add_new_block;
                event.stopPropagation();
            });
        self.drag_block_button.addEventListener('click',
            function (event) {
                document
                    .getElementById('content-menu')
                    .set_invoker(self)
                    .show(event);
            });
        self.addEventListener('click', self.click);
        self.addEventListener('keydown', self.keyDown);
        self.addEventListener('mouseup', self.check_selection);
        /*/--блок перемещаемый--/*/
        self.draggable();
        console.log('new block created!');
    }

    connectedCallback() {
        console.log('block connected!');
        console.log(this.db_model)
    }

    update_db_model() {
        console.log('updating block db_model...');
        this.#db_model = {
            id: this.id,
            order: this.index,
            page: this.parentElement.parentElement.id,
            content: this.#content.innerHTML
        };
        console.log('block db model updated!');
    }

    get index() {
        let i = 0;
        let result;
        for (let child of this.parentElement.children) {
            child.id = String(i);
            if (child === this) {
                result = String(i);
            }
            i++;
        }
        return result;
    }

    get db_model() {
        console.log('getting block db model...');
        this.update_db_model();
        return this.#db_model;
    }

    draggable() {
        console.log('making block draggable...');
        /*/--позиция блока (относительно страницы) до начала перетаскивания--/*/
        let position_left;
        let position_top;
        /*/--стиль блока до начала пертаскивания--/*/
        let old_style;
        /*/--измененный формат ссылки на самого себя--/*/
        let self = this;
        /*/--переменная для клона блока--/*/
        let clone;
        /*/--кнопка перетаскивания слушает событие когда ее нажмут--/*/
        self.drag_block_button.addEventListener('mousedown', function (event) {
            /*/--сохранение ширины блока для клона--/*/
            let old_width = self.getBoundingClientRect().width;
            /*/--сохранение стиля блока--/*/
            old_style = self.style;
            /*/--получение относительных координат блока--/*/
            position_left = self.getBoundingClientRect().left;
            position_top = self.getBoundingClientRect().top;
            /*/--клонирование блока--/*/
            do_clone();
            /*/--добавление клона блока на место блока/*/
            self.insertAdjacentElement('afterend', clone);
            /*/--извлечение блока из общего потока блоков в контейнере--/*/
            self.style.position = 'absolute';
            /*/--задание ширины перемещаемого блока как в контейнере--/*/
            self.style.width = old_width + 'px';
            /*/--перемещаемый блок прозрачаен для событий курсора--/*/
            self.style.pointerEvents = 'none';
            /*/--установка начальной позиции перемещаемого блока--/*/
            set_position(position_left, position_top);
            /*/--все блоки кроме перемещаемого становятся целью для
            его приема--/*/
            active_targets(true);
            /*/--окно слушает координаты курсора и окончание перемещения--/*/
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', stop);

            /*/--функция перемещения блока--/*/
            function move(event) {
                /*/--вычисление координат блока по оси Х--/*/
                position_left = position_left + event.movementX;
                /*/--вычисление координат блока по оси Y--/*/
                position_top = position_top + event.movementY;
                /*/--установка позиции блока по вычисленным значениям--/*/
                set_position(position_left, position_top);
            }

            /*/--функция завершения перемещения блока--/*/
            function stop(event) {
                /*/--проверка принадлежности цели к требуемой--/*/
                if (event.target.tagName === 'GOO-BLOCK') {
                    /*/--вставка перемещаемого блока после цели--/*/
                    event.target.insertAdjacentElement('afterend', self);
                }
                /*/--удаление клона--/*/
                clone.remove();
                /*/--применение перемещенному блоку сохраненного стиля--/*/
                self.style = old_style;
                /*/--выключение режима приема объекта--/*/
                active_targets(false);
                /*/--удаление слушателей у окна--/*/
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', stop);
            }

            /*/--функция установка позиции блока--/*/
            function set_position(x, y) {
                self.style.left = x + 'px';
                self.style.top = y + 'px';
            }

            /*/--создание сопии блока--/*/
            function do_clone() {
                let range = document.createRange();
                /*/--выбрать внутренний контент блока--/*/
                range.selectNodeContents(self.content);
                /*/--создание аналогичного блока с копией контента--/*/
                clone = new Block().set_content(range.cloneContents());
                clone.style.backgroundColor = 'rgba(100,100,200,0.3)';
            }

            /*/--функция переключения режима приема блока--/*/
            function active_targets(state) {
                /*/--для каждого блока на странице--/*/
                for (let child of self.parentElement.children) {
                    /*/кроме текущего блока/*/
                    if (child !== self) {
                        /*/--выключить активность поля редактирования контента--/*/
                        child.content.active = !state;
                    }
                }
            }
        });
        console.log('block draggable now!');
    }

    /*/--функция добавления нового блока--/*/
    get add_new_block() {
        console.log('adding new block...');
        /*/--создать новый блок--/*/
        let new_block = new Block();
        /*/--вставить новый блок после текущего--/*/
        this.insertAdjacentElement('afterend', new_block);
        /*/--установить фокус на вставленном блоке-/*/
        new_block.focus();
        return new_block;
    }

    /*/--функция добавления контента в блок--/*/
    set_content(content) {
        console.log('set content for block...');
        this.#content.append(content);
        console.log('content for block added!');
        return this;
    }

    /*/--предотвращение реакции других элементов на событие--/*/
    click(event) {
        event.stopPropagation();
    }

    /*/--осистить контент блока--/*/
    clear() {
        ContentManager.clear_content(this);
    }

    /**@return {Goo}*//*/--ссылка на редактируемое поле блока--/*/
    get content() {
        return this.#content;
    }

    /*//*/
    set content(content) {
        this.#content = content;
    }

    /**@return {Block|Element}*//*/--предыдущий блок--/*/
    get previous() {
        return this.previousElementSibling;
    }

    /**@type{VoidFunction}*//*/--фокусировка--/*/
    focus() {
        this.#content.focus();
    }

    /**@return {boolean}*//*/--блок последний?--/*/
    get is_last() {
        return this.nextElementSibling === null;
    }

    /**@type{VoidFunction}
     * @param {MouseEvent}event
     *//*/--проверка наличия выделения--/*/
    check_selection(event) {
        /*/--если контент выделен показать меню
        форматирования контента--/*/
        if (selectionExist()) {
            /*/--найти меню в документе--/*/
            let format_menu = document.getElementById('format-menu');
            /*/--сохранить выделение перед потерей фокуса--/*/
            ContentManager.range = document.getSelection().getRangeAt(0);
            /*/--показать меню форматирования--/*/
            format_menu.show(event);
        }
    }

    register_me() {
        this.host.current_block = this;
    }

    get is_alone() {
        return (this.nextElementSibling === null)
            & (this.previousElementSibling === null);
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
            content = ContentManager.content_after_caret;
            /*удалить полученный диапазон из текущего элемента*/
            if (ContentManager.range_after_caret) {
                ContentManager.range_after_caret.deleteContents();
            }
            /*добавить новый блок с скопированным контентом*/
            self.add_new_block.set_content(content);

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