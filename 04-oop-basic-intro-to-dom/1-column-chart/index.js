export default class ColumnChart {
  chartHeight = 50;
  maxValue = 0;
  subElements = {};

  constructor({data = [], label = '', value = 0, link} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  update(data) {
    this.subElements.body.innerHTML = this.createData(data);
  }

  destroy() {
    this.remove();
    this.element = null
    this.subElements = {};
  }

  remove() {
    this.element.remove();
  }

  getColumnChartClass() {
    return this.data.length ? "column-chart" : "column-chart column-chart_loading";
  }

  createData(data) {
    this.maxValue = Math.max.apply(null, data);
    return data.map(item => this.createColumn(item)).join('');
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
                                 ${this.value}
                               </div>
                               <div data-element="body" class="column-chart__chart">
                                 ${this.createData(this.data)}
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
