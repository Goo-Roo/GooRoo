export class ContentProcessor {
    /**@type{Range}*/
    static range;

    static get range_after_caret(){
        let activeBlock = document.activeElement;
        //позиция каретки в контенте блока
        let startNode = getSelection().anchorNode;
        let startOffset = getSelection().anchorOffset;
        //конец контента в блоке
        let endNode = activeBlock.lastChild;
        //если после каретки в блоке есть контент
        if (endNode) {
            let endOffset = endNode.textContent.length;
            //создать диапазон
            let range = document.createRange();
            //установить начало диапазона в позиции курсора
            range.setStart(startNode, startOffset);
            //установить конец диапазона в конце контента элемента
            range.setEnd(endNode, endOffset);
            //скопировать диапазон в переменную
            console.log(this,'range after caret:',range);
            return range;
        }
        return undefined;
    }

    static get content_after_caret() {
        if (this.range_after_caret){
            return this.range_after_caret.cloneContents();
        }
        return undefined;
    }

    static get range_before_caret(){
        let range= document.createRange();
        range.setStart(getSelection().focusNode,0);
        range.setEnd(getSelection().anchorNode,getSelection().anchorOffset);
        console.log(this,'range before caret:',range);
        return range;
    }
}