export default class SortableTable {
	element = null;
	subElements = {};
	constructor(headerConfig = [], {data = []} = {}) {
		this.headerConfig = headerConfig;
		this.data = data

		this.render()
	}

	getRows() {
		return this.data.map((row) => (
		`<div class='sortable-table__row'>
			${ this.headerConfig.map(({ id, template }) => (
			typeof template === 'function' ? template(row[id]) :
			`<div class='sortable-table__cell'>${ row[id] }</div>`
		)).join('') }
		</div>`))
		.join('');
	  }

	getHeaders(){
		return this.headerConfig.map(item => {
			return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
						<span>${item.title}</span>
						<span data-element="arrow" class="sortable-table__sort-arrow">
							<span class="sort-arrow"></span>
						</span>
					</div>	`
		}).join('')
	}

	sort(field, order) {
		this.sortData(order, field)
		this.updateRows()

		const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
		const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);
	
		// NOTE: Remove sorting arrow from other columns
		allColumns.forEach(column => {
			column.dataset.order = '';
		});
	
		currentColumn.dataset.order = order;
	
	}

	sortData (order, field) {
		const column = this.headerConfig.find(item => item.id === field);
		const { sortType } = column;
		const directions = {
		asc: 1,
		desc: -1
		};
		const direction = directions[order];
	
		this.data.sort((a, b) => {
		switch (sortType) {
		case 'number':
			return direction * (a[field] - b[field]);
		case 'string':
			return direction * a[field].localeCompare(b[field], ['ru', 'en']);
		default:
			return direction * (a[field] - b[field]);
		}
		});
	}

	updateRows() {
		const body = document.querySelector('.sortable-table__body')
		body.innerHTML = this.getRows()
	}
	render() {
		const div = document.createElement('div')
		div.innerHTML = `
		<div data-element="productsContainer" class="products-list__container">
		<div class="sortable-table">

		<div data-element="header" class="sortable-table__header sortable-table__row">
			${this.getHeaders()}
		</div>

		<div data-element="body" class="sortable-table__body">
			${this.getRows()}

		</div>

		<div data-element="loading" class="loading-line sortable-table__loading-line"></div>

		<div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
			<div>
			<p>No products satisfies your filter criteria</p>
			<button type="button" class="button-primary-outline">Reset all filters</button>
			</div>
		</div>

		</div>
	</div>
		`

		this.element = div.firstElementChild
		this.subElements = this.getSubElements(this.element);

		
	}

	getSubElements(element) {
		const elements = element.querySelectorAll('[data-element]');
	
		return [...elements].reduce((accum, subElement) => {
		accum[subElement.dataset.element] = subElement;
		return accum;
		}, {});
	}

	destroy() {
		this.element.remove()
	}
}

