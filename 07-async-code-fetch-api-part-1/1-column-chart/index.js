import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  maxValue = 0;
  data = {};
  subElements = {};
  backendURL = 'https://course-js.javascript.ru';

  constructor({
                url = '',
                range = {} = {
                  from: new Date(),
                  to: new Date()
                },
                label = '',
                value = 0,
                link
              } = {}) {
    this.url = new URL(url, BACKEND_URL);
    this.from = range.from;
    this.to = range.to;
    this.label = label;
    this.link = link;

    this.render();
    this.loadData(this.from, this.to);
  }

  async update(dateFrom, dateTo) {
    const data = this.loadData(dateFrom, dateTo);
    this.subElements.body.innerHTML = data;
    return data;
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }

  remove() {
    this.element.remove();
  }

  getColumnChartClass() {
    return this.data.length ? "column-chart" : "column-chart column-chart_loading";
  }

  async loadData(dateFrom, dateTo) {
    this.subElements.body.innerHTML = '';
    this.element.classList.add('column-chart_loading');

    this.url.searchParams.set('from', dateFrom.toISOString());
    this.url.searchParams.set('to', dateTo.toISOString());

    this.data = await fetchJson(this.url.toString());

    if (this.data && Object.values(this.data).length) {
      this.maxValue = Math.max.apply(null, Object.values(this.data));
      this.subElements.body.innerHTML = Object.values(this.data).map(item => this.createColumn(item)).join('');
      this.subElements.header.innerHTML = Object.values(this.data).reduce((sum, value) => sum += value);

      this.element.classList.remove('column-chart_loading');
    }
  }

  createColumn(value) {
    const height = Math.floor(value * this.chartHeight / this.maxValue);
    const percent = (value / this.maxValue * 100).toFixed(0) + "%";
    return `<div style="--value: ${height}" data-tooltip=${percent}></div>`;
  }

  render() {
    const columnChart = document.createElement('div');
    columnChart.className = this.getColumnChartClass();
    columnChart.style = `--chart-height: ${this.chartHeight}`;

    columnChart.innerHTML = `<div class="column-chart__title">
                               ${'Total ' + this.label}
                               ${this.link ? `<a class="column-chart__link" href=${this.link}>View all</a>` : ''}
                             </div>
                             <div class="column-chart__container">
                               <div data-element="header" class="column-chart__header">
                               </div>
                               <div data-element="body" class="column-chart__chart">
                               </div>
                             </div>`;

    this.element = columnChart;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }
}
