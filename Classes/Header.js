import {Goo} from "./Goo.js";
import {
    ADD_COVER_BUTTON,
    ADD_DISCUSSION_BUTTON,
    ADD_ICON_BUTTON
} from "./Buttons.js";

export class Header extends Goo {
    #control_panel;
    #title;

    constructor() {
        super();
        this.#control_panel = new Goo();
        this.#control_panel.className = 'page-header-control-panel';
        this.#control_panel.append(
            ADD_ICON_BUTTON,
            ADD_COVER_BUTTON,
            ADD_DISCUSSION_BUTTON);
        this.#title = new Goo();
        this.#title.className = 'page-title';
        this.#title.classList.add('placeholder-hard');
        this.#title.setAttribute('placeholder', 'UNTITLED');
        this.#title.contentEditable='true';
        this.append(
            this.#control_panel,
            this.#title);
    }
}

customElements.define('goo-page-header', Header);