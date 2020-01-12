import {Goo} from "./Goo.js";

export class App extends Goo {
    #overlay = new Goo();
    constructor() {
        super();
        this.#overlay.className='overlay';
        this.append(this.#overlay)
    }
}
customElements.define('goo-app',App);