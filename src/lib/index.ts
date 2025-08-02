// place files you want to import through the `$lib` alias in this folder.

export { Result } from "./utils/result";

export function select(selector: string): void {
    let element = document.querySelector(selector);
    let sel = document.getSelection();
    if (sel && element) {
        let range = document.createRange();
        range.selectNodeContents(element);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}