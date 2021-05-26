import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class SortableTable {
	element = null;
	subElements = {};
	loading = false;
	step = 20;
	start = 1;
	end = this.start + this.step;

	onWindowScroll = async () => {
		const { bottom } = this.element.getBoundingClientRect();
		const { id, order } = this.sorted;
	
		if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
		this.start = this.end;
		this.end = this.start + this.step;
	
		this.loading = true;
	
		const data = await this.loadData(id, order, this.start, this.end);
	
		this.updateRows();
	
		this.loading = false;
		}
	};

	constructor(headersConfig = [], {
		data = [],
		isSortLocally = false,
		sorted = {
			id: headersConfig.find(item => item.sortable).id,
			order: 'asc'
		},
		url = ''
	} = {}) {
		this.headersConfig = headersConfig;
		this.data = data;
		this.url = new URL(url, BACKEND_URL);
		this.isSortLocally = isSortLocally;
		this.sorted = sorted
		this.render()
	}

	getRows() {
		return this.data.map((row) => (
			`<div class='sortable-table__row'>
				${ this.headersConfig.map(({ id, template }) => (
				typeof template === 'function' ? template(row[id]) :
				` <div class='sortable-table__cell'>${row[id]}</div>`)).join('')
			} </div>`))
		.join('');
	}

	getHeaders() {
		

			return this.headersConfig.map(item => {
				const order = this.sorted.id === item.id ? this.sorted.order : 'asc';	
				return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
						<span>${item.title}</span>
						${this.getHeaderSortingArrow(item.id)}
					</div>	`
			}).join('')
	}

	getHeaderSortingArrow(id) {
		const isOrderExist = this.sorted.id === id ? this.sorted.order : '';
	
		return isOrderExist
			? `<span data-element="arrow" class="sortable-table__sort-arrow">
				<span class="sort-arrow"></span>
				</span>`
			: '';
	}

	setSortedCol(field, order) {
		const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
		const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);
		allColumns.forEach(column => {
			column.dataset.order = '';
		});

		currentColumn.dataset.order = order;
	}

	sortOnClient(field, order, defaultSort) {
		this.sortData(field, order)
		if (defaultSort) return

		this.updateRows()
		this.setSortedCol(field,order)
	}

	loadData(id, order, start = this.start, end = this.end, resetCount) {
		this.url.searchParams.set('_sort', id);
		this.url.searchParams.set('_order', order);
		this.url.searchParams.set('_start', start);
		this.url.searchParams.set('_end', end);

		this.element.classList.add('sortable-table_loading');

		const fetchData = fetchJson(this.url)
			
		return fetchData.then(res => {
			resetCount ? this.data = [...res] : this.data.push(...res)
			this.updateRows()
		}) 		
	}

	sortOnServer(id, order, start, end) {

		this.loadData(id, order, start, end, true)
		this.setSortedCol(id, order)
		this.sorted = {id, order}

	}

	sort(event) {
		const column = event.target.closest('[data-sortable="true"]');
		const toggleOrder = order => {
		const orders = {
			asc: 'desc',
			desc: 'asc'
		};

		return orders[order];
		};

		if (column) {

			const { id, order } = column.dataset;
			const newOrder = toggleOrder(order);
			this.sorted = {
				id,
				order: newOrder
			};
			column.dataset.order = newOrder;
			column.append(this.subElements.arrow);

			if (this.isSortLocally) {
				this.sortOnClient(id, newOrder);
			} else {
				this.sortOnServer(id, newOrder, 1, 1 + this.step);
			}
		}
		
	}

	sortData(field, order) {
		const column = this.headersConfig.find(item => item.id === field);
		const {
			sortType
		} = column;
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
		this.subElements.body.innerHTML = this.getRows()
	}
	
	addListeners() {
		this.subElements.header.addEventListener('pointerdown', event => this.sort(event))
		document.addEventListener('scroll', this.onWindowScroll )
	}

	async render() {
		const div = document.createElement('div')
		div.innerHTML = `
			<div data-element="productsContainer" class="products-list__container">
			<div class="sortable-table sortable-table_loading">

			<div data-element="header" class="sortable-table__header sortable-table__row">
				${this.getHeaders()}
			</div>

			<div data-element="body" class="sortable-table__body">
			<div data-element="loading" class="loading-line sortable-table__loading-line"></div>
			<div data-element="loading" class="loading-line sortable-table__loading-line"></div>
			<div data-element="loading" class="loading-line sortable-table__loading-line"></div>
			${this.getRows()}

			</div>


			

			</div>
		</div>
			`

		this.element = div.firstElementChild
		this.subElements = this.getSubElements(this.element);
		await this.loadData()
		this.addListeners()
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

{/* <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
				<div>
				<p>No products satisfies your filter criteria</p>
				<button type="button" class="button-primary-outline">Reset all filters</button>
				</div>
			</div> */}