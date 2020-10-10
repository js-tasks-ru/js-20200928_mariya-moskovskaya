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
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        delete this[prop];
      }
    }
  }

  remove() {
    this.element.remove();
  }

  render() {
    const columnChart = document.createElement('div');
    columnChart.className = this.data.length ? "column-chart" : "column-chart column-chart_loading";
    columnChart.style = `--chart-height: ${this.chartHeight}`;
    const maxValue = Math.max.apply(null, this.data);

    columnChart.innerHTML = `<div class="column-chart__title">
                               ${'Total ' + this.label}
                               ${createLink.call(this)}
                             </div>
                             <div class="column-chart__container">
                               <div data-element="header" class="column-chart__header">
                                 ${this.value}
                               </div>
                               <div data-element="body" class="column-chart__chart">
                                 ${createData.call(this)}
                               </div>
                             </div>`;

    this.element = columnChart;

    function createLink() {
      if (this.link) {
        return `<a class="column-chart__link" href=${this.link}>View all</a>`;
      }
      return '';
    }

    function getColumnChartClass() {
      if (this.data.length) {
        return "column-chart";
      }
      return "column-chart column-chart_loading";
    }

    function createData() {
      return this.data.reduce((result, item) => result += createColumn.call(this, item), '');
    }

    function createColumn(value) {
      const height = Math.floor(value * this.chartHeight / maxValue);
      const percent = (value / maxValue * 100).toFixed(0) + "%";
      return `<div style="--value: ${height}" data-tooltip=${percent}></div>`;
    }
  }
}
