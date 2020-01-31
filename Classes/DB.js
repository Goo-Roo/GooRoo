/*/--Класс управления базой данных приложения--/*/
export class DB {
    #_ready;
    get ready() {
        return this.#_ready;
    }

    set ready(value) {
        this.#_ready = value;
    }

    #_db;

    constructor() {
        const self = this;

    }

    #exec_operation = function (func, param) {
        let db;
        let db_request = indexedDB.open('GooRooDB', 2);
        db_request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.createObjectStore('covers', {keyPath: 'id'});
            db.createObjectStore('icons', {keyPath: 'id'});
            db.createObjectStore('pages', {keyPath: 'id'});
            db.createObjectStore('current page',{keyPath:'id'});
            //todo design db for discussions
        };
        db_request.onsuccess = function (event) {
            let db = event.target.result;
            func(param, db);
        };
        db_request.onerror = function (event) {
            console.error('Error opening DB', event.target.errorCode);
        };
    };
    #get_page = function (id, db) {
        let result;
        let transaction = db.transaction('pages', 'readonly');
        let store = transaction.objectStore('pages');
        store.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                if (cursor.value.id===id){
                    result = cursor.value;
                }
                cursor.continue();
            }
        };
        return result;
    };

    #get_current_page = function (db){
        let result;
        let transaction = db.transaction('current page', 'readwrite');
        let store = transaction.objectStore('current page');
        store.openCursor().onsuccess = function(event){
            let cursor=event.target.result;
            if (cursor){
                result=cursor.value;
            }
        };
        transaction.oncomplete = function () {
            console.log('current page stored');
        };
        transaction.onerror = function (event) {
            console.error('store current page error', event.target.errorCode);
        };
        return result;
    };

    #set_current_page = function (page, db) {
        let transaction = db.transaction('current page', 'readwrite');
        let store = transaction.objectStore('current page');
        store.clear();
        store.add(page.model);
        transaction.oncomplete = function () {
            console.log('current page stored');
        };
        transaction.onerror = function (event) {
            console.error('store current page error', event.target.errorCode);
        };
    };

    #add_page = function (page, db) {
        let transaction = db.transaction('pages', 'readwrite');
        let store = transaction.objectStore('pages');
        store.add(page.model);
        transaction.oncomplete = function () {
            console.log('page stored');
        };
        transaction.onerror = function (event) {
            console.error('store page error', event.target.errorCode);
        };
    };

    add_page(page) {
        this.#exec_operation(this.#add_page, page);
    }

    get_page(id) {
        return this.#exec_operation(this.#get_page, id)
    }

    set_current_page(id){
        this.#exec_operation(this.#set_current_page,id);
    }
    get_current_page(){
        return this.#exec_operation(this.#get_current_page)
    }

}