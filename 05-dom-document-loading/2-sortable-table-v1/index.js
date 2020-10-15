export default class SortableTable {
  subElements = {};

  constructor(header = [], data = []) {
    this.header = header;
    this.data = data;

    this.render();
  }

  render() {
    const table = document.createElement('div');

    table.innerHTML = `<div class="sortable-table">
                         <div data-elem="header" class="sortable-table__header sortable-table__row">
                           ${this.getHeaderColumns()}
                         </div>
                         <div data-element="body" class="sortable-table__body">
                           ${this.getRows()}
                         </div>
                       </div>`;

    this.element = table.firstElementChild;
    this.subElements = this.getSubElements(this.element);
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
        `<div class="sortable-table__cell" data-name="${item.id}" data-sortable="${!item.template}">
           <span>${item.title}</span>
         </div>`);
    });

    return result.join('');
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

    const sortColumn = this.element.querySelector(`[data-name=${field}]`);

    sortColumn.dataset.order = direction;

    document.querySelectorAll(`[class="sortable-table__sort-arrow"]`)
      .forEach(elem => elem.remove());

    sortColumn.insertAdjacentHTML("beforeend",
      `<span class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>`);

    [...this.subElements.body.children].forEach(child => child.remove());

    this.subElements.body.insertAdjacentHTML("beforeend", `${this.getRows()}`);

    this.subElements = this.getSubElements(this.element);
  }
}

