export default class SortableTable {
	element = null;
	subElements = {};
	constructor(headerConfig = [], {data = []} = {}) {
		this.headerConfig = headerConfig;
		this.data = data

		this.render()
		console.log(this)
	}

	getRows() {
		return this.data.map(item => {
			return `
				<a href="/products/${item.id}" class="sortable-table__row">
					<div class="sortable-table__cell">
						<img class="sortable-table-image" alt="Image" src="${item.images ? item.images[0].url : 'https://via.placeholder.com/32' }">
					</div>
					<div class="sortable-table__cell">${item.title}</div>
					<div class="sortable-table__cell">${item.quantity}</div>
					<div class="sortable-table__cell">${item.price}</div>
					<div class="sortable-table__cell">${item.sales}</div>
				</a>`
			}).join('')
	}

	getHeaders(){
		return this.headerConfig.map(item => {
			return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
						<span>${item.title}</span>
					</div>	`
		}).join('')
	}

	sort(fieldValue, orderValue) {
		const { sortType } = this.headerConfig.find(({ id }) => id === fieldValue)
		function sortStrings(arr, param = 'asc') {
			return arr.sort( (a, b) => {
				if(param === 'desc') {
					return  -String(a[fieldValue]).localeCompare(String(b[fieldValue]), "ru", {caseFirst:"upper", numeric: sortType === 'number'})
				} else if (param === 'asc'){
					return String(a[fieldValue]).localeCompare(String(b[fieldValue]), "ru", {caseFirst:"upper", numeric: sortType === 'number'})
				}
				throw new Error();
			})
		}  
		console.log(this.data)
		sortStrings(this.data, orderValue)
		this.updateRows()
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

