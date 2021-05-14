export default class ColumnChart {
    constructor({
        data = [],
        label = '',
        link = '',
        value = 0,
        formatHeading = null
    } = {}) {
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = value;
        this.formatHeading = formatHeading;
        this.render()
    }
    chartHeight = 50

    renderColumns() {
        if(this.data.length ?? false) {
            return this.data.map(item => {
                return ` <div style="--value: ${this.getColumnHeight(item).value}" data-tooltip="${this.getColumnHeight(item).percent}"></div>`
            }).join('')
        } else {
            return ''
        }
    }

    skelet() {
        if (this.data.length) {
            return '';
        } else {
            return 'column-chart_loading'
        }
        
    }

    formatHeading(data) {
        this.element.querySelector('.column-chart__header').textContent = data
    }
    getColumnHeight(data) {
        const maxValue = Math.max(...this.data);
        const scale = this.chartHeight / maxValue;
        return {
            percent: (data / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(data * scale))
        }
    }

    update(newData = []) {
        if(this.data.join('') !== newData.join('') && newData.length ) {
            this.data = newData
            this.element.querySelector('.column-chart__chart').innerHTML = this.renderColumns()
            this.element.classList.remove('column-chart_loading')
        } else if (!newData.length) {
            this.element.classList.add('column-chart_loading')
        }
    }
    getLink () {
        if (!this.link) return ``
        return `<a href="${this.link}" class="column-chart__link">View all</a>`
    }
    
    render() {
        let div = document.createElement('div');
        div.innerHTML =`

        <div class="column-chart ${this.skelet()}" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
                Total ${this.label}
                ${this.getLink()}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading ? this.formatHeading(this.value) : this.value}</div>
                <div data-element="body" class="column-chart__chart">
                ${this.renderColumns()}
                </div>
            </div>
        </div>
        `;
        this.element = div.firstChild.nextSibling
    }

    destroy(){
        this.element.remove()
    }
    
    remove(){
        this.element.remove()
    }

}
