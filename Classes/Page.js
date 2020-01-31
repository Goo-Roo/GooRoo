import {Goo} from "./Goo.js";
import {Header} from "./Header.js";
import {Block} from "./Block.js";
import {generateId} from "./functions.js";
import {db} from "../scripts/main.js";


customElements.define('goo-block', Block);

export class Page extends Goo {
    #cover;
    #header;
    #content;
    #db_model = {
        id: undefined,
        cover: undefined,
        discussion: undefined,
        icon: undefined
    };
    #pathID ={
        id:undefined
    };

    constructor(id) {
        super();
        if (id) {
            this.id = id;
        } else {
            /*/--присвоить странице новый ID--/*/
            let random = generateId(2);
            this.id = random[0] + '-' + random[1];
        }

    }


    connectedCallback() {
        console.log(db.get_page("3376516481-2254125479"));
        this.#cover = new Goo();
        this.#cover.className = 'page-cover';
        this.#header = new Header();
        this.#content = new Page.Content;
        this.append(
            this.#cover,
            this.#header,
            this.#content);
        db.add_page(this);
        db.set_current_page(this);
    }

    update_db_model() {
        console.log('updating page db_model...');
        this.#db_model = {
            id: this.id,
            //todo make cover as db object {id,path to image file}
            cover: undefined,
            //todo make discussion as db object {id,person,content}
            discussion: undefined,
            //todo make icon as db object {id, path to icon file}
            icon: undefined
        };
        console.log('block db model updated!');
    }

    get model() {
        this.update_db_model();
        return this.#db_model;
    }
    get pathID(){
        this.#pathID = {id: this.id}
    }


    static get Content() {
        class Content extends Goo {
            #current_block;

            constructor() {
                super();
                //todo: design function 'load content blocks' for existing pages

            }

            connectedCallback() {
                this.load_content(this.parentElement.id);
                this.append(new Block());
                let self = this;
                this.addEventListener('click', function () {
                    self.last_block.focus();
                });
            }

            load_content(page_id) {//todo---------------------------
                /*
                for blocks with page_id do add to this content.
                example:
                this.append(new Block(get id from db).set_content(get content from db))
                but if page with defined page_id contains no blocks create new one;
                 */
            }

            /**@return {HTMLCollectionOf<Block|Element>}*/
            get blocks() {
                return this.getElementsByTagName('goo-block');
            }

            get current_block() {
                return this.#current_block;
            }

            set current_block(block) {
                this.#current_block = block;
            }

            /**@return {Block|Element}*/
            get last_block() {
                return this.lastElementChild;
            }

            new_block(content) {
                let block = new Block();
                if (content) {
                    block.content.append(content);
                }
                if (!this.current_block.is_last) {
                    this.insertBefore(block, this.#current_block.nextElementSibling);
                } else {
                    this.append(block);
                }
                this.current_block = block;
                this.current_block.focus();
            }
        }

        customElements.define('goo-page-content', Content);
        return Content;
    }

    get content() {
        return this.#content;
    }
}

customElements.define('goo-page', Page);
