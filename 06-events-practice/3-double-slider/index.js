export default class DoubleSlider {
  element;
  slider;
  thumbs = {};
  currentThumb;

  position = {
    shiftX: 0,
    startPosition: 0,
    endPosition: 0,
    width: 0
  };

  onMouseMove = event => {
    event.preventDefault();

    const { clientX } = event;
    const { shiftX, startPosition, endPosition, width } = this.position;

    if (this.currentThumb.className.toString().includes('left')) {
      let newPosition = clientX - startPosition + shiftX;

      if (newPosition < 0) {
        newPosition = 0;
      }

      if (newPosition > width) {
        newPosition = width;
      }

      newPosition = newPosition / width * 100;

      if (newPosition > 100 - parseFloat(this.thumbs.thumbRight.style.right)) {
        newPosition = 100 - parseFloat(this.thumbs.thumbRight.style.right);
      }
      this.currentThumb.style.left = `${newPosition}%`;
      this.slider.firstElementChild.style.left = `${newPosition}%`;
      this.element.firstElementChild.innerHTML = this.format(this.getValue().from);
    } else {
      let newPosition = endPosition - clientX - shiftX;

      if (newPosition < 0) {
        newPosition = 0;
      }

      if (newPosition > width) {
        newPosition = width;
      }

      newPosition = newPosition / width * 100;

      if (newPosition > 100 - parseFloat(this.thumbs.thumbLeft.style.left)) {
        newPosition = 100 - parseFloat(this.thumbs.thumbLeft.style.left);
      }
      this.currentThumb.style.right = `${newPosition}%`;
      this.slider.firstElementChild.style.right = `${newPosition}%`;
      this.element.lastElementChild.innerHTML = this.format(this.getValue().to);
    }
  };

  onMouseUp = () => {
    this.element.classList.remove('range-slider_dragging');
    this.removeListeners();
  };

  constructor({
                min = 0,
                max = 100,
                formatValue = value => value,
                selected = {from: min, to: max}
              } = {}) {
    this.min = min;
    this.max = max;
    this.format = formatValue;
    this.selectedFrom = selected.from;
    this.selectedTo = selected.to;

    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    Object.values(this.thumbs).forEach(thumb => thumb.addEventListener('pointerdown', event => {
      this.currentThumb = thumb;
      this.element.classList.add('range-slider_dragging');

      event.preventDefault();

      this.getInitialPosition(event);

      document.addEventListener('pointermove', this.onMouseMove);
      document.addEventListener('pointerup', this.onMouseUp);
    }));
  }

  getInitialPosition (event) {
    if (this.currentThumb === this.thumbs.thumbLeft) {
      this.position.shiftX = this.currentThumb.getBoundingClientRect().right - event.clientX;
    } else {
      this.position.shiftX = this.currentThumb.getBoundingClientRect().left - event.clientX;
    }
    this.position.startPosition = this.slider.getBoundingClientRect().left;
    this.position.endPosition = this.slider.getBoundingClientRect().right;
    this.position.width = this.slider.getBoundingClientRect().width;
  }

  render () {
    const element = document.createElement('div');
    const leftStyle = (this.selectedFrom - this.min) / (this.max - this.min) * 100;
    const rightStyle = (this.max - this.selectedTo) / (this.max - this.min) * 100;

    element.innerHTML = `
      <div class="range-slider">
        <span data-element="from">${this.format(this.selectedFrom)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${leftStyle}%; right: ${rightStyle}%"></span>
          <span class="range-slider__thumb-left" style="left: ${leftStyle}%"></span>
          <span class="range-slider__thumb-right" style="right: ${rightStyle}%"></span>
        </div>
        <span data-element="to">${this.format(this.selectedTo)}</span>
      </div>
    `;

    this.element = element.firstElementChild;
    this.slider = this.element.querySelector('.range-slider__inner');
    this.thumbs.thumbLeft = this.element.querySelector('.range-slider__thumb-left');
    this.thumbs.thumbRight = this.element.querySelector('.range-slider__thumb-right');
  }

  remove () {
    this.element.remove();
  }

  removeListeners () {
    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.onMouseUp);

    this.element.dispatchEvent(new CustomEvent('range-select', {
      detail: this.getValue(),
      bubbles: true
    }));
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }

  getValue() {
    const scale = this.max - this.min;
    const { left } = this.thumbs.thumbLeft.style;
    const { right } = this.thumbs.thumbRight.style;

    const from = Math.round(this.min + parseFloat(left) * scale / 100);
    const to = Math.round(this.max - parseFloat(right) * scale / 100);

    return { from, to };
  }
}
