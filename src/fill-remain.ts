import { getScrollParent, h, isEL, isRange, range, useRaf } from "./utils"

document.head.appendChild(h('style', { innerHTML: 'wc-fill-remain{display:block}' }))

export class FillRemain extends HTMLElement {
  scroller: HTMLDivElement | Window | undefined
  scrollParent: HTMLDivElement | undefined
  sizeObs!: ResizeObserver

  constructor() {
    super()
    // const root = this.attachShadow({ mode: 'open' })
    // this.appendChild(h('style', { innerHTML: ':host{display:block}' }))
  }

  connectedCallback() {
    this.scroller = getScrollParent(this)
    this.sizeObs = new ResizeObserver(this.update)
    isEL(this.scroller) && this.sizeObs.observe(this.scroller)
    window.addEventListener('resize', this.update)
    this.update()
  }

  disconnectedCallback() {
    this.scroller = undefined
    this.sizeObs.disconnect()
    window.removeEventListener('resize', this.update)
  }

  update = () => {
    this.style.minHeight = '0'
    this.style.height = '0'
    this.offsetHeight

    const nill = h('div')
    const scroll = this.scroller!
    const parent = isEL(scroll) ? scroll : document.body
    parent.appendChild(nill)
    parent.offsetHeight
    const rect = nill.getBoundingClientRect()
    nill.remove()
    
    // parent.offsetHeight
    const boundary = isEL(scroll) ? scroll.getBoundingClientRect().bottom : window.innerHeight
    this.style.minHeight = rect.top > boundary ? `` : `${boundary - rect.top}px`
    this.style.height = ''
  }
}

customElements.define('wc-fill-remain', FillRemain)
