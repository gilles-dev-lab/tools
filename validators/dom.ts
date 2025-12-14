export function assertElement<T extends Element>(el: T | null | undefined, name = 'element'): asserts el is T {
  if (el == null) {
    throw new Error(`${name} must not be null or undefined`);
  }
}

export function querySelectorAssert<K extends keyof HTMLElementTagNameMap>(
  selector: string,
  parent: Document | Element = document,
  name?: string
): HTMLElementTagNameMap[K] {
  const el = parent.querySelector(selector) as HTMLElementTagNameMap[K] | null;
  assertElement(el, name ?? `Element matching "${selector}"`);
  return el;
}

export function getByIdAssert<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id) as T | null;
  assertElement(el, `#${id}`);
  return el;
}
