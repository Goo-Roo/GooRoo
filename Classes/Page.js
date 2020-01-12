import {Goo} from "./Goo.js";
import {Header} from "./Header.js";
import {Block} from "./Block.js";

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
