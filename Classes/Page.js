import {Goo} from "./Goo.js";
import {Header} from "./Header.js";
import {
    ADD_BLOCK_BUTTON,
    DRAG_BLOCK_BUTTON
} from "./Buttons.js";


class Block extends Goo {
    #host;
    #content;

    constructor(host) {
        super();
        this.#content = new Goo();
        this.#content.className = 'block-content';
        this.#content.classList.add('placeholder-soft');
        this.#content.setAttribute('placeholder', "наберите '?' для команд");
        this.#content.contentEditable = 'true';
        let control_panel = new Goo();
        control_panel.className='block-control-panel';
        control_panel
            .append(
                ADD_BLOCK_BUTTON,
                DRAG_BLOCK_BUTTON);
        this.append(
            control_panel,
            this.#content);
        this.#host = host;
    }

    focus() {
        this.#content.focus();
    }
}

customElements.define('goo-block', Block);

export class Page extends Goo {
    #cover;
    #header;
    #content;

    constructor() {
        super();
        this.#cover = new Goo();
        this.#cover.className = 'page-cover';
        this.#header = new Header();
        this.#content = new Page.Content;
        this.append(
            this.#cover,
            this.#header,
            this.#content);
    }

    connectedCallback() {
    }


    static get Content() {
        class Content extends Goo {
            #current_block;

            constructor() {
                super();
                this.#current_block = new Block(this);
                this.append(this.#current_block);
                let self = this;
                this.addEventListener('click', function () {
                    self.last_block.focus();
                });
            }

            /**@return {HTMLCollectionOf<Block|Element>}*/
            get blocks() {
                return this.getElementsByTagName('goo-block');
            }

            new_block() {
                let block = new Block(this);
                this.append(block);
                block.focus();
            }

            /**@return {Block|Element}*/
            get last_block() {
                return this.lastElementChild;
            }
        }

        customElements.define('goo-page-content', Content);
        return Content;
    }
}

customElements.define('goo-page', Page);
