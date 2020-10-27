export default class SortableTable {
  subElements = {};
  defaultDirection = 'asc';

  onSort = (event) => {
    const headerColumn = event.target.closest('[data-sortable="true"]');
    const arrow = headerColumn.querySelector(`.sortable-table__sort-arrow`);

    headerColumn.dataset.order = headerColumn.dataset.order === 'desc' ? 'asc' : 'desc';

    this.sort(headerColumn.dataset.id, headerColumn.dataset.order);

    if (!arrow) {
      headerColumn.append(this.subElements.arrow);
    }

    [...this.subElements.body.children].forEach(child => child.remove());

    this.subElements.body.insertAdjacentHTML("beforeend", `${this.getRows()}`);

    this.subElements = this.getSubElements(this.element, '[data-element]');
  }

  constructor(header = [], data = []) {
    this.header = header;
    this.data = data;
    this.defaultSortColumn = this.header.filter(item => item.sortable)[0].id;

    this.render();
  }

  render() {
    const table = document.createElement('div');

    table.innerHTML = `<div class="sortable-table">
                         <div data-element="header" class="sortable-table__header sortable-table__row">
                           ${this.getHeaderColumns()}
                         </div>
                         <div data-element="body" class="sortable-table__body">
                           ${this.getRows()}
                         </div>
                       </div>`;

    this.element = table.firstElementChild;
    this.element = table.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initEventListeners();

    this.sort(this.defaultSortColumn, this.defaultDirection);
  }

  initEventListeners() {
    this.subElements.header.addEventListener("pointerdown", this.onSort);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  getHeaderColumns() {
    const result = [];

    this.header.forEach(item => {
      result.push(
        `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="asc">
           <span>${item.title}</span>
           ${item.id === this.defaultSortColumn ? this.getArrow() : ''}
         </div>`);
    });

    return result.join('');
  }

  getArrow() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>`;
  }

  getRows() {
    return this.data.data.map(item => `<a href="${item.id}" class="sortable-table__row">
                                         ${this.getRowContent(item)}
                                       </a>`).join('');
  }

  getRowContent(item) {
    return this.header.map(column => column.template ? column.template(item[column.id])
      : `<div class="sortable-table__cell">${item[column.id]}</div>`).join('');
  }

  destroy() {
    if (this.element) {
      this.remove();
      this.element = null;
    }
  }

  remove() {
    this.element.remove();
  }

  sort(field, direction) {
    this.data.data.sort((a, b) => {
      function compareValues(a, b) {
        if (typeof a == 'number') {
          return (a - b);
        } else {
          return a.toString().localeCompare(b, 'ru', {caseFirst: 'upper'});
        }
      }

      switch (direction) {
        case 'asc':
          return compareValues(a[field], b[field]);
        case 'desc':
          return compareValues(a[field], b[field]) * (-1);
        default:
          break;
      }
    });
  }
}
