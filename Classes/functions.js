export function execCommand(range, command, param) {
    let selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand(command, false, param);
}

/**
 * Удаление блока если он не последний
 * @param{Block} block
 */
export function remove_block(block) {
    if (!block.is_alone) {
        block.remove();
    } else{
        block.clear();
    }
}