import {Goo} from "./Goo.js";
import {Header} from "./Header.js";







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

    static get Content(){
        class Content extends Goo {

        }
        customElements.define('goo-page-content', Content);
        return Content;
    }
}

customElements.define('goo-page', Page);
