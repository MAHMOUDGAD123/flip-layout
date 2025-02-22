import { MagicLayout } from "./magic-layout.mjs";

(() => {
  /** @type {HTMLDivElement} */
  const boxes = document.querySelector(".boxes");
  const N = 30;

  // initialization
  let frag = new DocumentFragment();
  for (let i = 1; i <= N; ++i) {
    frag.appendChild(createBox(i));
  }
  boxes.appendChild(frag);

  new MagicLayout({
    layoutElement: boxes,
    duration: 500,
    triggersId_actions: new Map([
      ["f-none", noneAction],
      ["f-odd", customAction(isOdd)],
      ["f-even", customAction(isEven)],
      ["f-prime", customAction(isPrime)],
      ["f-2th", customAction(is2th)],
    ]),
  });

  // Tools
  // ==============================================
  /**
   * @param {string} index
   * @param {boolean} animate
   * @returns {HTMLDivElement}
   */
  function createBox(index) {
    const div = document.createElement("div");
    div.id = `box-${index}`;
    div.innerText = `${index}`;
    div.className = "box";
    div.style.opacity = 0;
    div.style.animation = `fade-in 1s ${index * 30}ms forwards`;
    return div;
  }

  /**
   * @param {number} n
   * @returns {boolean}
   */
  function isOdd(n) {
    return n & 1;
  }

  /**
   * @param {number} n
   * @returns {boolean}
   */
  function isEven(n) {
    return !isOdd(n);
  }

  /**
   * @param {number} n a number to check
   * @returns {boolean} the result
   */
  function isPrime(n) {
    if (n < 2) return false;
    const half_n = n >>> 1;
    for (let i = 2; i <= half_n; ++i) if (!(n % i)) return false;
    return true;
  }

  /**
   * @param {number} n a number to check
   * @returns {boolean} the result
   */
  function is2th(n) {
    return n && !(n & (n - 1));
  }

  // Actions
  // ==============================================
  /** @param {HTMLElement} layoutElement */
  function noneAction(layoutElement) {
    for (let i = 1, box = null, prev = null; i <= N; ++i) {
      box = document.getElementById(`box-${i}`);

      if (!box) {
        box = createBox(i);
        if (!prev) {
          layoutElement.insertAdjacentElement("afterbegin", box);
        } else {
          layoutElement.insertBefore(box, prev.nextSibling);
        }
      }
      prev = box;
    }
  }

  /**
   * custom action functoin take a filter parameter
   * @param {(n: number) => boolean} filter the filter function
   */
  function customAction(filter) {
    return (layoutElement) => {
      for (let i = 1, box = null, prev = null; i <= N; ++i) {
        box = document.getElementById(`box-${i}`);

        if (filter(i)) {
          if (!box) {
            box = createBox(i);
            if (!prev) {
              layoutElement.insertAdjacentElement("afterbegin", box);
            } else {
              layoutElement.insertBefore(box, prev.nextSibling);
            }
          }
          prev = box;
        } else {
          box?.remove();
        }
      }
    };
  }
})();
