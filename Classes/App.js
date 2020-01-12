import {Goo} from "./Goo.js";
import {MainFrame} from "./MainFrame.js";
import {SideBar} from "./SideBar.js";

export class App extends Goo {
    #overlay = new Goo();
    #side_bar;
    #main_frame;
    constructor() {
        super();
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
}

customElements.define('goo-app', App);