class Tooltip {
  static instance;

  onMouseOver = (event) => {
    if (event.target.dataset.tooltip) {
      this.render(event.target.dataset.tooltip);
      document.addEventListener("pointermove", this.onMouseMove);
    }
  };

  onMouseOut = () => {
    this.remove();
  };

  onMouseMove = (event) => {
    const left = event.clientX + 10;
    const top = event.clientY + 10;
    const maxLeft = window.innerWidth - this.element.clientWidth;
    const maxTop = window.innerHeight - this.element.clientHeight;

    this.element.style.left = `${left < maxLeft ? left : maxLeft}px`;
    this.element.style.top = `${top < maxTop ? top : maxTop}px`;
  };

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initEventListeners() {
    document.addEventListener("pointerover", this.onMouseOver);
    document.addEventListener("pointerout", this.onMouseOut);
  }

  initialize() {
    this.initEventListeners();
  }

  render(text) {
    const tooltip = document.createElement('div');

    tooltip.className = "tooltip";
    tooltip.innerHTML = text;

    this.element = tooltip;

    document.body.append(this.element);
  }

  destroy() {
    document.removeEventListener("pointerover", this.onMouseOver);
    document.removeEventListener("pointerout", this.onMouseOut);
    if (this.element) {
      this.remove();
      this.element = null;
    }
  }

  remove() {
    document.removeEventListener("pointermove", this.onMouseMove);
    if (this.element) {
      this.element.remove();
    }
  }
}

const tooltip = new Tooltip();

export default tooltip;
