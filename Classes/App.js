import {Goo} from "./Goo.js";
import {MainFrame} from "./MainFrame.js";
import {SideBar} from "./SideBar.js";
import {FORMAT_MENU} from "./Menus.js";
import {CONTENT_MENU} from "./Menus.js";
import {db} from "../scripts/main.js"

export class App extends Goo {
    #overlay = new Goo();
    #side_bar;
    #main_frame;
    #range;
    constructor() {
        super();
        this.#overlay
            .append(
                FORMAT_MENU,
                CONTENT_MENU);
        this.#overlay.className = 'overlay';
        this.#side_bar = new SideBar();
        this.#main_frame = new MainFrame();
        let splitter = new Goo();
        splitter.className = 'splitter';
        splitter.append(
            this.#side_bar,
            this.#main_frame);
        this.#side_bar.make_resizable();
        this.append(splitter, this.#overlay);
    }

    connectedCallback(){
    }

    get range(){
        return this.#range;
    }

    set range(range){
        this.#range=range;
    }
}

customElements.define('goo-app', App);