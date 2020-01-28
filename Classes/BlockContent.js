import {Goo} from "./Goo.js";

export class BlockContent extends Goo {
    constructor() {
        super();
        const self = this;
        self.classList.add('placeholder-soft');
        self.setAttribute('placeholder', "наберите '?' для команд");
        self.active=true;
    }
    set active(state){
        let self=this;
        if (state){
            this.contentEditable='true';
            this.style.pointerEvents='auto';
            this.style.userSelect='auto';
        }else{
            this.contentEditable='false';
            this.style.pointerEvents='none';
            this.style.userSelect='none';
        }
    }
}