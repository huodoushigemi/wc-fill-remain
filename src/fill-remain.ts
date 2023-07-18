import { getScrollParent, h, isEL } from "./utils"

document.head.appendChild(h('style', { innerHTML: 'wc-fill-remain{display:block}' }))

export class FillRemain extends HTMLElement {
  #scroller: HTMLDivElement | Window | undefined
  #sizeObs!: ResizeObserver
  #childObs!: MutationObserver

  get #father() {
    return isEL(this.#scroller) ? this.#scroller : document.body
  }

  connectedCallback() {
    this.#scroller = getScrollParent(this)
    this.#sizeObs = new ResizeObserver(this.#update)
    this.#sizeObs.observe(this.#father)
    const children = [...this.#father.children]
    children.forEach(e => this.#sizeObs.observe(e))
  
    this.#childObs = new MutationObserver(ms => {
      let flag = true
      ms.forEach(m => {
        if (flag) flag = !m.addedNodes.length
        m.addedNodes.forEach(e => isEL(e) && (this.#sizeObs.observe(e), attrObs(e)))
        m.removedNodes.forEach(e => isEL(e) && this.#sizeObs.unobserve(e))
      })
      flag && this.#update()
    })
    this.#childObs.observe(this.#father, { childList: true, attributes: true })
    const attrObs = (e: Element) => this.#childObs.observe(e, { attributes: true })
    children.forEach(attrObs)

    window.addEventListener('resize', this.#update)
  }

  disconnectedCallback() {
    this.#scroller = undefined
    this.#sizeObs.disconnect()
    this.#childObs.disconnect()
    window.removeEventListener('resize', this.#update)
  }

  #flag = false
  #update = async () => {
    if (this.#flag) return
    this.#flag = true
    await Promise.resolve()
    this.#_update()
    requestAnimationFrame(() => this.#flag = false)
  }
  
  #_update = () => {
    // console.log('update');
    
    this.style.minHeight = '0'
    this.style.height = '0'

    const nill = h('div')
    this.#father.appendChild(nill)
    const rect = nill.getBoundingClientRect()
    nill.remove()
    
    const boundary = isEL(this.#scroller) ? this.#scroller.getBoundingClientRect().bottom : Math.max(window.innerHeight, document.documentElement.getBoundingClientRect().bottom)
    this.style.minHeight = rect.top > boundary ? `` : `${boundary - rect.top - parseInt(getComputedStyle(this.#father).paddingBottom)}px`
    this.style.height = ''

    this.#childObs.takeRecords()
  }
}

customElements.define('wc-fill-remain', FillRemain)
