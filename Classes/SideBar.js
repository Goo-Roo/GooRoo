import {Goo} from "./Goo.js";

export class SideBar extends Goo {
    #resizer;
    constructor() {
        super();
        this.#resizer = new Goo();
        this.#resizer.className = 'resizer';
        this.append(this.#resizer);
    }
    make_resizable() {//----/возможность изменять размер/---------------------!
        const leftElement = this;// <-resizable element                |
        const rightElement = leftElement.nextSibling;// <-make room element     |
        const resizer = this.#resizer;
        const minimum_width = 200;// <-minimal width                        |
        const maximum_width = 400;// <-maximal width                        |
        let original_width = 0;//                                           |
        let original_x = 0;//                                               |
        let original_mouse_x = 0;//                                         |
        const resizeCursor =//                                              |
            `cursor: url(../resources/resizer-cursor.png) 10 15, default`;//
        //----активировать изменение ширины элемента------------------!
        resizer.addEventListener('mousedown', function (e) { //       |
            e.preventDefault();//                                     |
            original_width =//                                        |
                parseFloat(getComputedStyle(leftElement, null)//      |
                    .getPropertyValue('width')//                      |
                    .replace('px', ''));//                            |
            original_x = leftElement.getBoundingClientRect().left;//  |
            original_mouse_x = e.pageX;//                             |
            document.body.style.cssText = resizeCursor;//             |
            addListeners();//                                         |
        });//____________________________________________конец.функции|
        //----добавить прослушивание событий------------------!
        function addListeners() {//                           |
            window.addEventListener('mousemove', resize);//   |
            window.addEventListener('mouseup', stopResize);// |
        }//______________________________________конец.функции|
        //----изменение ширины элемента------------------------------------!
        function resize(e) {//                                             |
            const width = original_width + (e.pageX - original_mouse_x);// |
            //----ограничение минимальной и максимальной ширины элемента-! |
            if ((width > minimum_width) && (width < maximum_width)) {//ze| |
                leftElement.style.width = width + 'px';//                | |
                rightElement.style.width = `calc(100% - ${width}px)`;//  | |
            }//_____________________________________________конец.условия| |
        }//___________________________________________________конец функции|
        //
        //----/установить курсор по умолчанию/-----------------!
        function stopResize() {//                              |                |
            document.body.style.cssText = `cursor: default`;// |                |
            window.removeEventListener('mousemove', resize)//  |                |
        }//_______________________________________конец.функции|                |
    }//___________________________________________________________/конец.функции|
}
customElements.define('goo-side-bar', SideBar);