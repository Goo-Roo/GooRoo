import {Goo} from "./Goo.js";
import {Button} from "./Buttons.js";
import {app} from "../scripts/main.js";

const CROSS_ICON =
    '../resources/cross.svg#cross';
const DRAG_ICON =
    '../resources/drag.svg#drag';

export class Block extends Goo {
    #host;
    #content;
    #add_block_button;
    #drag_block_button;

    constructor(host) {
        super();
        this.#host = host;
        const self = this;
        this.#content = new Goo();
        this.#content.className = 'block-content';
        this.#content.classList.add('placeholder-soft');
        this.#content.setAttribute('placeholder', "наберите '?' для команд");
        this.#content.contentEditable = 'true';
        this.#content.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        this.#content.addEventListener('mouseup', this.check_selection);
        this.#add_block_button =
            new Button.Builder('add-block-button'/*класс*/)
                .icon(CROSS_ICON, 16/*шир и выс*/)
                .size(16/*ширина*/, 16/*высота*/)
                .build();
        this.#drag_block_button =
            new Button.Builder('drag-block-button'/*класс*/)
                .icon(DRAG_ICON, 16/*шир и выс*/)
                .size(16/*ширина*/, 16/*высота*/)
                .build();
        this.#add_block_button.addEventListener('click', function () {
            self.#host.new_block();
        });
        this.#drag_block_button.addEventListener('click', function (event) {
            document.getElementById('content-menu').show(event);
        });
        let control_panel = new Goo();
        control_panel.className = 'block-control-panel';
        control_panel
            .append(
                this.#add_block_button,
                this.#drag_block_button);
        this.append(
            control_panel,
            this.#content);
    }

    focus() {
        this.#content.focus();
    }

    check_selection(event) {
        //если контент выделен показать меню форматирования контента
        if (selectionExist()) {
            let format_menu = document.getElementById('format-menu');
            app.range = document.getSelection().getRangeAt(0);
            /**@type {Range}*/
            format_menu.show(event);
        }
    }
}

/**@returns{boolean}*/
function selectionExist() {
    return !document.getSelection().isCollapsed;
}

