/**
 * обрабатывает контент внутри блока <div>
 */
export class ContentManager {
    /**@type{Range}*/
    static range;
    static ranges = new Map();

    static save_to_range(key, node) {
        this.range = document.createRange();
        this.range.selectNodeContents(node);
        this.ranges.set(key,this.range);
        this.range.detach();
    }
    static get_range(key){
        this.range=this.ranges.get(key);
        this.ranges.delete(key);
        return this.range;
    }


    static get range_after_caret() {
        //создать диапазон
        let range = document.createRange();
        let activeBlock = document.activeElement;
        //позиция каретки в контенте блока
        let startNode = getSelection().anchorNode;
        let startOffset = getSelection().anchorOffset;
        //конец контента в блоке
        let endNode = activeBlock.lastChild;
        //если после каретки в блоке есть контент
        if (endNode) {
            let endOffset = endNode.textContent.length;
            //установить начало диапазона в позиции курсора
            range.setStart(startNode, startOffset);
            //установить конец диапазона в конце контента элемента
            range.setEnd(endNode, endOffset);
        }
        return range;
    }

    static get content_after_caret() {
        return this.range_after_caret.cloneContents();
    }

    static get range_before_caret() {
        let range = document.createRange();
        range.setStart(getSelection().focusNode, 0);
        range.setEnd(getSelection().anchorNode, getSelection().anchorOffset);
        return range;
    }
}