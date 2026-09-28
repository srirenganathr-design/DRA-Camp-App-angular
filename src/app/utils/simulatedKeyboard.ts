export type SimulatedKeyboardLayout = 'numeric' | 'decimal' | 'qwerty';

export type KeyboardKeyVariant = 'char' | 'function' | 'space';

export interface KeyboardKeyDef {
  id: string;
  label?: string;
  variant?: KeyboardKeyVariant;
  flex?: number;
}

export interface KeyboardRowDef {
  keys: (KeyboardKeyDef | null)[];
  indent?: boolean;
}

export function isSimulatedKeyboardEnabled() {
  if (typeof window === 'undefined') return false;

  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const isTouchPrimary =
    window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(hover: none)').matches;

  return hasFinePointer && !isTouchPrimary;
}

export function isTextInputElement(element: Element | null): element is HTMLInputElement | HTMLTextAreaElement {
  if (!element) return false;
  if (element instanceof HTMLTextAreaElement) return true;
  if (!(element instanceof HTMLInputElement)) return false;
  if (element.hasAttribute('data-skip-simulated-keyboard')) return false;

  const type = element.type.toLowerCase();
  return (
    type === 'text' ||
    type === 'search' ||
    type === 'tel' ||
    type === 'url' ||
    type === 'email' ||
    type === 'password' ||
    type === 'number' ||
    type === ''
  );
}

export function keyboardLayoutForElement(element: HTMLInputElement | HTMLTextAreaElement): SimulatedKeyboardLayout {
  if (element instanceof HTMLInputElement) {
    const inputMode = element.inputMode;
    if (inputMode === 'numeric' || element.type === 'tel') {
      return 'numeric';
    }
    if (inputMode === 'decimal') {
      return 'decimal';
    }
  }

  return 'qwerty';
}

export function physicalKeyToMockKey(key: string): string | null {
  if (key === ' ') return 'Space';
  if (key === 'Backspace' || key === 'Enter') return key;
  if (key === '+' || key === '-' || key === '.') return key;
  if (key === ',') return ',';
  if (/^\d$/.test(key)) return key;
  if (/^[a-zA-Z]$/.test(key)) return key.toLowerCase();
  return null;
}

const SCREEN_WIDTH = 360;
const SCREEN_HEIGHT = 800;

function isPhoneFrameRect(rect: DOMRect) {
  return (
    rect.width >= SCREEN_WIDTH - 15 &&
    rect.width <= SCREEN_WIDTH + 15 &&
    rect.height >= SCREEN_HEIGHT - 60 &&
    rect.height <= SCREEN_HEIGHT + 15
  );
}

function findPhoneFrame(start?: Element | null): Element | null {
  const root = document.getElementById('root');
  if (!root) return null;

  let node = start instanceof Element ? start : null;
  while (node && node !== root) {
    if (isPhoneFrameRect(node.getBoundingClientRect())) {
      return node;
    }
    node = node.parentElement;
  }

  for (const candidate of root.querySelectorAll('div')) {
    if (isPhoneFrameRect(candidate.getBoundingClientRect())) {
      return candidate;
    }
  }

  return null;
}

export function getScreenRect(anchor?: Element | null): DOMRect | null {
  const screen = findPhoneFrame(anchor);
  return screen?.getBoundingClientRect() ?? null;
}

export const SIMULATED_KEYBOARD_HEIGHT = 291;

const KEYBOARD_SCROLL_GAP = 8;
const KEYBOARD_SCROLL_MARGIN_ATTR = 'data-keyboard-scroll-margin';
const KEYBOARD_SCROLL_PADDING_ATTR = 'data-keyboard-scroll-padding';

function isScrollableY(element: Element) {
  const style = window.getComputedStyle(element);
  if (!/(auto|scroll|overlay)/.test(style.overflowY)) return false;
  return element.scrollHeight > element.clientHeight;
}

function getScrollTarget(element: HTMLElement) {
  return (
    element.closest<HTMLElement>('[data-name="TextField"]') ??
    element.closest<HTMLElement>('[class*="field"]') ??
    element
  );
}

function getScrollableAncestors(element: HTMLElement) {
  const ancestors: HTMLElement[] = [];
  let node = element.parentElement;

  while (node) {
    if (isScrollableY(node)) {
      ancestors.push(node);
    }
    node = node.parentElement;
  }

  return ancestors;
}

let scrollAdjustmentInProgress = false;

export function isScrollAdjustmentInProgress() {
  return scrollAdjustmentInProgress;
}

function scrollAncestorsBy(element: HTMLElement, delta: number) {
  if (delta === 0) return;

  scrollAdjustmentInProgress = true;
  let remaining = delta;
  for (const ancestor of getScrollableAncestors(element)) {
    const before = ancestor.scrollTop;
    ancestor.scrollTop += remaining;
    remaining -= ancestor.scrollTop - before;
    if (remaining === 0) break;
  }
  window.requestAnimationFrame(() => {
    scrollAdjustmentInProgress = false;
  });
}

export function applyKeyboardScrollAdjustments(
  element: HTMLInputElement | HTMLTextAreaElement,
  keyboardHeight: number,
) {
  const scrollPadding = `${keyboardHeight + KEYBOARD_SCROLL_GAP}px`;
  const target = getScrollTarget(element);

  element.style.scrollMarginBottom = scrollPadding;
  element.setAttribute(KEYBOARD_SCROLL_MARGIN_ATTR, 'true');

  for (const ancestor of getScrollableAncestors(element)) {
    ancestor.style.scrollPaddingBottom = scrollPadding;
    ancestor.setAttribute(KEYBOARD_SCROLL_PADDING_ATTR, 'true');
  }

  if (target !== element) {
    target.style.scrollMarginBottom = scrollPadding;
    target.setAttribute(KEYBOARD_SCROLL_MARGIN_ATTR, 'true');
  }
}

export function clearKeyboardScrollAdjustments(element: HTMLInputElement | HTMLTextAreaElement | null) {
  if (!element) return;

  const target = getScrollTarget(element);
  const elements = new Set<HTMLElement>([element, target, ...getScrollableAncestors(element)]);

  for (const node of elements) {
    if (node.hasAttribute(KEYBOARD_SCROLL_MARGIN_ATTR)) {
      node.style.scrollMarginBottom = '';
      node.removeAttribute(KEYBOARD_SCROLL_MARGIN_ATTR);
    }
    if (node.hasAttribute(KEYBOARD_SCROLL_PADDING_ATTR)) {
      node.style.scrollPaddingBottom = '';
      node.removeAttribute(KEYBOARD_SCROLL_PADDING_ATTR);
    }
  }
}

function getStickyObstructionBottom(anchor: HTMLElement) {
  const scrollBody = anchor.closest('[data-wizard-scroll-body]');
  if (!scrollBody) return 0;

  let bottom = 0;
  for (const child of scrollBody.children) {
    if (!(child instanceof HTMLElement)) continue;
    if (window.getComputedStyle(child).position !== 'sticky') continue;

    const rect = child.getBoundingClientRect();
    if (rect.height > 0) {
      bottom = Math.max(bottom, rect.bottom);
    }
  }

  return bottom;
}

export function ensureRefractionPickerVisible(
  anchor: HTMLElement,
  overlayHeight: number,
  keyboardHeight: number = 0,
  gap: number = KEYBOARD_SCROLL_GAP,
) {
  if (scrollAdjustmentInProgress) return;

  const screenRect = getScreenRect(anchor);
  if (!screenRect) return;

  const obstructionBottom = getStickyObstructionBottom(anchor);
  const viewportTop = Math.max(screenRect.top + gap, obstructionBottom + gap);
  const viewportBottom = screenRect.bottom - keyboardHeight - gap;

  let anchorRect = anchor.getBoundingClientRect();

  const ensureInputVisible = () => {
    if (anchorRect.top < viewportTop) {
      scrollAncestorsBy(anchor, anchorRect.top - viewportTop);
      anchorRect = anchor.getBoundingClientRect();
    }
  };

  const ensurePickerFitsBelow = () => {
    const pickerBottom = anchorRect.bottom + gap + overlayHeight;
    if (pickerBottom > viewportBottom) {
      scrollAncestorsBy(anchor, pickerBottom - viewportBottom);
      anchorRect = anchor.getBoundingClientRect();
    }
  };

  ensureInputVisible();
  ensurePickerFitsBelow();
  ensureInputVisible();
}

export function ensureInputVisibleAboveKeyboard(
  element: HTMLInputElement | HTMLTextAreaElement,
  keyboardHeight: number = SIMULATED_KEYBOARD_HEIGHT,
) {
  applyKeyboardScrollAdjustments(element, keyboardHeight);

  const runScroll = () => {
    const screenRect = getScreenRect(element);
    if (!screenRect) return;

    const target = getScrollTarget(element);
    const availableBottom = screenRect.bottom - keyboardHeight - KEYBOARD_SCROLL_GAP;
    const targetRect = target.getBoundingClientRect();

    if (targetRect.bottom > availableBottom) {
      scrollAncestorsBy(element, targetRect.bottom - availableBottom);
    }

    const refreshedTop = target.getBoundingClientRect().top;
    if (refreshedTop < screenRect.top + KEYBOARD_SCROLL_GAP) {
      scrollAncestorsBy(element, refreshedTop - (screenRect.top + KEYBOARD_SCROLL_GAP));
    }
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(runScroll);
  });
}

function char(id: string): KeyboardKeyDef {
  return { id, variant: 'char' };
}

function fn(id: string, label?: string, flex?: number): KeyboardKeyDef {
  return { id, label, variant: 'function', flex };
}

function keyRow(keys: (KeyboardKeyDef | null)[], indent = false): KeyboardRowDef {
  return { keys, indent };
}

export const KEYBOARD_LAYOUTS: Record<SimulatedKeyboardLayout, KeyboardRowDef[]> = {
  numeric: [
    keyRow([char('1'), char('2'), char('3')]),
    keyRow([char('4'), char('5'), char('6')]),
    keyRow([char('7'), char('8'), char('9')]),
    keyRow([null, char('0'), fn('Backspace', undefined, 1)]),
  ],
  decimal: [
    keyRow([fn('+', '+'), fn('-', '-'), fn('Backspace', undefined, 1)]),
    keyRow([char('1'), char('2'), char('3')]),
    keyRow([char('4'), char('5'), char('6')]),
    keyRow([char('7'), char('8'), char('9')]),
    keyRow([char('.'), char('0'), fn('Enter', undefined, 1)]),
  ],
  qwerty: [
    keyRow([
      char('q'),
      char('w'),
      char('e'),
      char('r'),
      char('t'),
      char('y'),
      char('u'),
      char('i'),
      char('o'),
      char('p'),
    ]),
    keyRow(
      [
        char('a'),
        char('s'),
        char('d'),
        char('f'),
        char('g'),
        char('h'),
        char('j'),
        char('k'),
        char('l'),
      ],
      true,
    ),
    keyRow([
      fn('Shift', undefined, 1.35),
      char('z'),
      char('x'),
      char('c'),
      char('v'),
      char('b'),
      char('n'),
      char('m'),
      fn('Backspace', undefined, 1.35),
    ]),
    keyRow([
      char(','),
      { id: 'Space', label: 'English (US)', variant: 'space', flex: 4 },
      char('.'),
      fn('Enter', undefined, 1.35),
    ]),
  ],
};

export function keyboardKeyVariant(key: KeyboardKeyDef): KeyboardKeyVariant {
  return key.variant ?? 'char';
}

export function keyboardKeyFlex(key: KeyboardKeyDef): number {
  return key.flex ?? 1;
}
