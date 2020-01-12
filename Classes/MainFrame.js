import {Goo} from "./Goo.js";
import {Page} from "./Page.js";
import {TopBar} from "./TopBar.js";



export class MainFrame extends Goo {
    #top_bar;
    #page;

    constructor() {
        super();
        this.#top_bar = new TopBar();
        this.#page = new Page();
        this.append(this.#top_bar, this.#page);
    }

    set page(page) {
        this.#page = page;
    }

    get page() {
        return this.#page;
    }

    new_page() {
        let new_page = new Page();
        if (this.#page) {
            this.replaceChild(new_page, this.page);
        }
        this.page = new_page;
    }
}

customElements.define('goo-main-frame', MainFrame);