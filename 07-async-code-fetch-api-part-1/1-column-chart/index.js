import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    chartHeight = 50
    constructor({
        data = [],
        label = '',
        link = '',
        range = {
            from: '2020-04-06',
            to: '2020-05-06',
        },
        url = '',
        value = 0,
        formatHeading = data => data
    } = {}) {
        this.data = data;
        this.label = label;
        this.link = link;
        this.range = range;
        this.url = url
        this.value = value;
        this.formatHeading = formatHeading;
        this.render()
        this.fetchData()
    }
    

    formatHeading(data) {
        this.element.querySelector('.column-chart__header').textContent = data
    }

    renderColumns() {
        if(this.data.length || false) {
            return this.data.map(item => {
                return ` <div style="--value: ${this.getColumnHeight(item).value}" data-tooltip="${this.getColumnHeight(item).percent}"></div>`
            }).join('')
        } else {
            return ''
        }
    }

    getColumnHeight(data) {
        const maxValue = Math.max(...this.data);
        const scale = this.chartHeight / maxValue;
        return {
            percent: (data / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(data * scale))
        }
    }
    setData = data => {
        const newData = []
        for( const val of Object.values(data)) {
            newData.push(val)
            this.value += val
        }
        this.data = newData
        this.subElements.body.innerHTML = this.renderColumns()
        this.subElements.header.innerHTML = this.value;
        this.showSkelet()

    }
    fetchData(dataFrom = this.range.from, dataTo = this.range.to) {
        const data = fetchJson(`${BACKEND_URL}/${this.url}?from=${dataFrom}&to=${dataTo}`)
        .then(res => {
            this.setData(res)
            return res
        })
        return data
    }
    showSkelet() {
        this.data.length ?
        this.element.classList.remove('column-chart_loading') :
        this.element.classList.add('column-chart_loading')
    }
    skelet() {
        return this.data.length ? '' : 'column-chart_loading'
    }

    update(dataFrom, DataTo) {
        return this.fetchData(dataFrom, DataTo)
        
    }

    getLink () {
        return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ``;
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
        this.element = div.firstElementChild
        this.subElements = this.getSubElements(this.element)
    }

    getSubElements(element) {
		const elements = element.querySelectorAll('[data-element]');
	
		return [...elements].reduce((accum, subElement) => {
		accum[subElement.dataset.element] = subElement;
		return accum;
		}, {});
	}

    destroy(){
        this.element.remove()
    }
    
    remove(){
        this.element.remove()
    }

}
