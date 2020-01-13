export class ContentProcessor {
    /**@type{Range}*/
    static range;

    static get content_after_caret() {
        let content;
        //активный блок
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
            content = range.cloneContents();
        }
        return content;
    }

}