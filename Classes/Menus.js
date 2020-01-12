import {Goo} from "./Goo.js";

export class Menu extends Goo{
    menu_items=[];

    constructor(builder) {
        super();
        this.classList.add(builder.name);
        this.menu_items=builder.menu_items;
        for (let menuItem of this.menu_items) {
            this.append(menuItem)
        }
        if (builder.pSize){
            this.style.width=builder.pSize.width;
            this.style.height=builder.pSize.height;
        }

    }
    static get Builder(){
        class Builder{

            // noinspection JSMismatchedCollectionQueryUpdate
            menu_items=[];
            constructor(name){
                this.name=name;
            }
            size(width, height) {
                this.pSize = {
                    width: width+'px',
                    height: height+'px'
                };
                return this;
            }
            add_item(button,command){
                button.addEventListener('click',command);
                this.menu_items.push(button);
                return this;
            }
            build(){
                return new Menu(this);
            }
        }
        return Builder;
    }
    show(){
        show(this);
    }
    hide(){
        hide(this);
    }
}
const overlay=document.getElementsByClassName('goo-app')[0];
function show(self) {
    window.addEventListener('click',hide);
    self.style.visibility='visible';
    overlay.style.pointerEvents='auto';
}

function hide(self){
    self.style.visibility='hidden';
    overlay.style.pointerEvents='none';
    window.removeEventListener('click',hide);
}
customElements.define('goo-menu',Menu);