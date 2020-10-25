import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  subElements = {};
  order = "asc";
  start = 0;
  loadingCount = 30;
  data = [];

  onSort = async (event) => {
    const headerColumn = event.target.closest('[data-sortable="true"]');
    const arrow = headerColumn.querySelector(`.sortable-table__sort-arrow`);

    if (this.sortColumn === headerColumn.dataset.id) {
      headerColumn.dataset.order = this.order = headerColumn.dataset.order === 'desc' ? 'asc' : 'desc';
    } else {
      this.order = headerColumn.dataset.order;
      this.sortColumn = headerColumn.dataset.id;
    }

    if (this.isServerSort) {
      this.data = await this.sortOnServer(this.sortColumn, this.order);
    } else {
      this.data = this.sortOnClient(this.sortColumn, this.order);
    }

    if (!arrow) {
      headerColumn.append(this.subElements.arrow);
    }

    [...this.subElements.body.children].forEach(child => child.remove());

    this.subElements.body.insertAdjacentHTML("beforeend", `${this.getRows(this.data)}`);

    this.subElements = this.getSubElements(this.element, '[data-element]');
  }

  onScroll = async () => {
    const data = await this.loadData();
    this.subElements.body.insertAdjacentHTML("beforeend", `${this.getRows(data)}`);
    this.data.concat(data);
  }

  constructor(header = [], {url = ""}) {
    this.header = header;
    this.sortColumn = this.header.filter(item => item.sortable)[0].id;
    this.url = new URL(url, BACKEND_URL);
    this.isServerSort = true;

    this.render();
  }

  async render() {
    const table = document.createElement('div');

    table.innerHTML = `<div class="sortable-table">
                         <div data-element="header" class="sortable-table__header sortable-table__row">
                           ${this.getHeaderColumns()}
                         </div>
                         <div data-element="body" class="sortable-table__body">
                         </div>
                       </div>`;

    this.element = table.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.data = await this.loadData(this.sortColumn, this.order);

    if (this.data.length) {
      this.subElements.body.innerHTML = this.getRows(this.data);

      this.element.classList.remove('sortable-table_empty');
    } else {
      this.element.classList.add('sortable-table_empty');
    }

    this.initEventListeners();
  }

  async loadData({column = this.sortColumn, order = this.order}) {
    this.url.searchParams.set('_sort', column);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', this.start);
    this.url.searchParams.set('_end', this.start += this.loadingCount);

    this.element.classList.add('sortable-table_loading');

    const data = await fetchJson(this.url);

    this.element.classList.remove('sortable-table_loading');

    return data;
  }

  initEventListeners() {
    this.subElements.header.addEventListener("pointerdown", this.onSort);
    document.addEventListener("scroll", this.onScroll);
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
           ${item.id === this.sortColumn ? this.getArrow() : ''}
         </div>`);
    });

    return result.join('');
  }

  getArrow() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>`;
  }

  getRows(data) {
    return (!data) ? "" : data.map(item => `<a href="${item.id}" class="sortable-table__row">
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

  async sortOnServer(column, order) {
    this.start = 0;

    const data = await this.loadData(column, order);

    return data;
  }

  sortOnClient(column, order) {
    return [...this.data].sort((a, b) => {
      function compareValues(a, b) {
        if (typeof a == 'number') {
          return (a - b);
        } else {
          return a.toString().localeCompare(b, 'ru', {caseFirst: 'upper'});
        }
      }

      switch (order) {
        case 'asc':
          return compareValues(a[this.sortColumn], b[this.sortColumn]);
        case 'desc':
          return compareValues(a[this.sortColumn], b[this.sortColumn]) * (-1);
        default:
          break;
      }
    });
  }
}

