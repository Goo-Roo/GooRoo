import {Goo} from "./Goo.js";
import {Button} from "./Buttons.js";
import {execCommand} from "./functions.js";
import {app} from "../scripts/main.js";
import {remove_block} from "./functions.js";


export class Menu extends Goo {
    menu_items = [];
    #position = {left: 0, top: 0};
    /**@type{Block}*/
    #invoker;

    constructor(builder) {
        super();
        this.classList.add(builder.name);
        this.id = builder.id;
        this.menu_items = builder.menu_items;
        for (let menuItem of this.menu_items) {
            this.append(menuItem)
        }
        if (builder.pSize) {
            this.style.width = builder.pSize.width;
            this.style.height = builder.pSize.height;
        }
        this.#position = builder.position;

    }

    static get Builder() {
        class Builder {
            position = {left: 0, top: 0};
            // noinspection JSMismatchedCollectionQueryUpdate
            menu_items = [];

            constructor(name) {
                this.name = name;
            }

            setID(id) {
                this.id = id;
                return this;
            }

            size(width, height) {
                this.pSize = {
                    width: width + 'px',
                    height: height + 'px'
                };
                return this;
            }

            add_item(button, command) {
                button.addEventListener('click', command);
                this.menu_items.push(button);
                return this;
            }

            relative_position(left, top) {
                this.position.left = left;
                this.position.top = top;
                return this;
            }

            build() {
                return new Menu(this);
            }
        }

        return Builder;
    }

    get position() {
        return this.#position;
    }

    /**@return {Block}*/
    get invoker(){
        return this.#invoker;
    }

    /**@param {Block}invoker
     * @return {Menu}*/
    set_invoker(invoker) {
        this.#invoker = invoker;
        return this;
    }

    show(event) {
        let overlay = document.getElementsByClassName('overlay').item(0);
        let menu = this;
        menu.style.left = menu.position.left + event.pageX + 'px';
        menu.style.top = menu.position.top + event.pageY + 'px';
        menu.style.visibility = 'visible';
        overlay.style.pointerEvents = 'auto';
        overlay.addEventListener('click', hide);

        function hide() {
            menu.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
            overlay.removeEventListener('click', hide);
        }
    }
}

customElements.define('goo-menu', Menu);
/*----------------------------------------/ICONS FOR MENU ITEMS/------------------------------------------------------*/
const UNDERLINE_ICON =
    "../resources/underline.svg#underline";
const ITALIC_ICON =
    "../resources/italic.svg#italic";
const STRIKE_ICON =
    "../resources/strike.svg#strike";
const BOLD_ICON =
    "../resources/bold.svg#bold";
const TRASH_ICON =
    "../resources/trash.svg#trash";

/*---------------------------------------/ITEMS FOR FORMAT MENU/------------------------------------------------------*/
const UNDERLINE_ITEM =
    new Button.Builder('underline')
        .size(20, 20)
        .icon(UNDERLINE_ICON, 16)
        .build();
const ITALIC_ITEM =
    new Button.Builder('italic')
        .size(20, 20)
        .icon(ITALIC_ICON, 16)
        .build();
const STRIKE_ITEM =
    new Button.Builder('strike')
        .size(20, 20)
        .icon(STRIKE_ICON, 16)
        .build();
const BOLD_ITEM =
    new Button.Builder('bold')
        .size(20, 20)
        .icon(BOLD_ICON, 16)
        .build();
/*--------------------------------------------/FORMAT MENU/-----------------------------------------------------------*/
export const FORMAT_MENU =
    new Menu
        .Builder('horizontal')
        .setID('format-menu')
        .add_item(
            UNDERLINE_ITEM, function () {
                execCommand(app.range, 'underline')
            })
        .add_item(
            ITALIC_ITEM, function () {
                execCommand(app.range, 'italic')
            })
        .add_item(
            STRIKE_ITEM, function () {
                execCommand(app.range, 'strikethrough')
            })
        .add_item(
            BOLD_ITEM, function () {
                execCommand(app.range, 'bold')
            })
        .relative_position(-40, -40)
        .build();


/*-----------/BUTTONS FOR CONTENT MENU/-------------------*/
const DELETE_BUTTON =
    new Button.Builder('delete')
        .size(100, 25)
        .icon(TRASH_ICON, 16)
        .text('Удалить')
        .build();

/*----------------/CONTENT MENU/--------------------------------*/
export const CONTENT_MENU =
    new Menu
        .Builder('vertical')
        .setID('content-menu')
        .relative_position(-110, -10)
        .add_item(
            DELETE_BUTTON,
            function () {
                remove_block(CONTENT_MENU.invoker);
            })
        .build();