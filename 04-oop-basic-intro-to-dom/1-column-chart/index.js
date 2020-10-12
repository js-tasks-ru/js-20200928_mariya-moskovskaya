export default class ColumnChart {
  chartHeight = 50;

  constructor({data = [], label = '', value = 0, link} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  update(arr) {
    this.data = arr;
    this.render();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  remove() {
    this.element.remove();
  }

  getColumnChartClass() {
    if (this.data.length) {
      return "column-chart";
    }
    return "column-chart column-chart_loading";
  }

  createData() {
    return this.data.reduce((result, item) => result += this.createColumn(item), '');
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

    this.maxValue = Math.max.apply(null, this.data);

    columnChart.innerHTML = `<div class="column-chart__title">
                               ${'Total ' + this.label}
                               ${this.link ? `<a class="column-chart__link" href=${this.link}>View all</a>` : ''}
                             </div>
                             <div class="column-chart__container">
                               <div data-element="header" class="column-chart__header">
                                 ${this.value}
                               </div>
                               <div data-element="body" class="column-chart__chart">
                                 ${this.createData()}
                               </div>
                             </div>`;

    this.element = columnChart;
    this.subElements = this.element.childNodes;
  }
}
