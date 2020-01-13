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

                this.append(new Block(this));
                let self = this;
                this.addEventListener('click', function () {
                        self.last_block.focus();
                });
            }

            /**@return {HTMLCollectionOf<Block|Element>}*/
            get blocks() {
                return this.getElementsByTagName('goo-block');
            }

            get current_block() {
                return this.#current_block;
            }

            set current_block(block) {
                this.#current_block = block;
            }

            /**@return {Block|Element}*/
            get last_block() {
                return this.lastElementChild;
            }

            new_block(content) {
                let block = new Block(this);
                block.content.append(content);
                if (!this.current_block.is_last) {
                    this.insertBefore(block, this.#current_block.nextElementSibling);
                } else {
                    this.append(block);
                }
                this.current_block = block;
                this.current_block.focus();
            }
        }

        customElements.define('goo-page-content', Content);
        return Content;
    }

    get content() {
        return this.#content;
    }
}

customElements.define('goo-page', Page);
