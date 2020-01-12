import {Goo} from "./Goo.js";
import {Header} from "./Header.js";



class Content extends Goo {
}

customElements.define('goo-page-content', Content);

export class Page extends Goo {
    #cover;
    #header;
    #content;

    constructor() {
        super();
        this.#cover = new Goo();
        this.#cover.className = 'page-cover';
        this.#header = new Header();
        this.#content = new Content();
        this.append(
            this.#cover,
            this.#header,
            this.#content);
    }
}

customElements.define('goo-page', Page);
