export function execCommand(range, command, param) {
    let selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand(command, false, param);
}