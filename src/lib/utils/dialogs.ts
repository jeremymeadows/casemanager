export function open_dialog_modal(id: string) {
  (document.getElementById(id) as HTMLDialogElement).showModal();
}

export function close_dialog(ev: MouseEvent) {
  let el = ev.target as HTMLElement;

  while (el.tagName.toLowerCase() !== 'dialog') {
    el = el.parentElement;
  }
  (el as HTMLDialogElement).close();
}
