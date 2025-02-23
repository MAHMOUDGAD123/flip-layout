export class MagicLayout {
  /**@type {Map<string, { start: {x: number, y: number}, end: {x: number, y: number}, delta: {x: number, y: number} }>}*/
  #positions = new Map();

  /**@type {HTMLElement}*/
  #layoutEle = null;

  /**@type {Map<string, (layoutElement: HTMLElement) => void>}*/
  #tiggersMap = null;

  /**@type {number} */
  #duration;

  /**@type {boolean} */
  #magicEnabled = true;

  /**
   * @param {{
   *    layoutElement: HTMLElement;
   *    duration: number;
   *    triggersId_actions: Map<string, (layoutElement: HTMLElement) => void>;
   * }} config layout configuration
   */
  constructor(config) {
    this.#layoutEle = config.layoutElement;
    this.#tiggersMap = config.triggersId_actions;
    this.#duration = config?.duration ?? 500;

    this.#tiggersMap.forEach((action, id) => {
      document.getElementById(id).onclick = () => {
        this.#magicEnabled ? this.#flip(action) : action(this.#layoutEle);
      };
    });
  }

  /**@param {boolean} value enable or disable the layout magic effect */
  toggleLayoutMagic(value) {
    this.#magicEnabled = value;
  }

  #setStartPositions() {
    for (const ele of this.#layoutEle.children) {
      const rect = ele.getBoundingClientRect();
      this.#positions.set(ele.id, {
        start: {
          x: rect.x,
          y: rect.y,
        },
        end: {
          x: 0,
          y: 0,
        },
        delta: {
          x: 0,
          y: 0,
        },
      });
    }
  }

  #setEndPositionsAndDelta() {
    for (const ele of this.#layoutEle.children) {
      const rect = ele.getBoundingClientRect();
      const pos = this.#positions.get(ele.id);
      pos.end.x = rect.x;
      pos.end.y = rect.y;
      pos.delta.x = pos.start.x - pos.end.x;
      pos.delta.y = pos.start.y - pos.end.y;
    }
  }

  /**
   * this function make all the magic animation in the layout
   * @param {(layoutElement: HTMLElement) => void} action the callback action function to update the layout
   */
  #flip(action) {
    this.#setStartPositions();
    action(this.#layoutEle);

    // get the last position after reflow and before the next paint
    requestAnimationFrame(() => {
      this.#setEndPositionsAndDelta();

      for (const ele of this.#layoutEle.children) {
        const delta = this.#positions.get(ele.id).delta;
        // jump
        ele.style.transform = `translateX(${delta.x}px) translateY(${delta.y}px)`;
        ele.style.transition = "transform 0s";

        // make the CSS see the change before the next repaint
        // to enable the transition
        requestAnimationFrame(() => {
          // animate
          ele.style.transform = "translateX(0) translateY(0)";
          ele.style.transition = `transform ${this.#duration}ms`;
        });
      }
    });

    console.clear();
    console.log(this.#positions);
  }
}
