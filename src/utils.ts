export const range = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max))
export const isRange = (val: number, min: number, max: number) => val > min && val < max

export const camlize = (s: string) => s.replace(/-\w/g, (e => e.slice(1).toUpperCase()))
export const hyphenate = (s: string) => s.replace(/(.)([A-Z])/g, (_, s: string, w: string) => s + '-' + w.toLowerCase())

export const isEL = (e: any): e is HTMLElement => e instanceof HTMLElement

export function remove<T>(list: T[], e: T) {
  const i = list.indexOf(e)
  ~i && list.splice(i, 1)
}

export function h<K extends keyof HTMLElementTagNameMap, P extends HTMLElementTagNameMap[K]>(tag: K, props?: Partial<P> | null, children?: Element[]): HTMLElementTagNameMap[K] {
  const el = Object.assign(document.createElement(tag), props)
  children && el.replaceChildren(...children)
  return el
}

export function getScrollParent(el: HTMLElement): HTMLDivElement | Window {
  while(el = el.parentElement!) {
    const { overflowY } = getComputedStyle(el)
    if (overflowY === 'auto' || overflowY === 'scroll') return el as HTMLDivElement
  }
  return el || window
}

export function useRaf(cb: (r: number) => void, d = 200) {
  let raf = 0
  return {
    looping: false,
    st: 0,
    r: 0,
    loop() { if (!this.looping) return; const r = this.r = Math.min((+new Date - this.st) / d, 1); cb(r); if (r >= 1) return this.pause(); raf = requestAnimationFrame(() => this.loop()) },
    resume() { this.st = +new Date; this.looping = true; this.loop() },
    pause() { this.looping = false; cancelAnimationFrame(raf) },
  }
}

