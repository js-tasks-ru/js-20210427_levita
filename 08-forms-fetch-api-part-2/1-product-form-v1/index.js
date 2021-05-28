import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
	element;
	subElements = {};

	constructor (productId = '', {
		url = '',
	} = {}) {
		this.productId = productId;
		this.url = new URL(url, BACKEND_URL);
		this.clientId = IMGUR_CLIENT_ID;
	}

	loadCategories() {
		const urlCat = new URL(this.url)
		urlCat.searchParams.set('_sort', 'weight');
		urlCat.searchParams.set('_refs', 'subcategory');
		urlCat.pathname = '/api/rest/categories';
		return fetchJson(urlCat)

	}

	async loadProduct(id = '', options = {}) {
		console.log(options)
		const productUrl = new URL(this.url)
		productUrl.pathname = '/api/rest/products';
		if (id) productUrl.searchParams.set('id', id)
		
		return await fetchJson(productUrl, options)
	}
	async loadData() {
		const dataArr = [];
		dataArr.push(this.loadCategories())
		
		if (this.productId) {
			dataArr.push(this.loadProduct(this.productId))
		}

		return await Promise.all(dataArr).then(values => {
			[this.caterories, this.product] = values
			this.product = this.product ? this.product[0] : []
			this.element = this.getForm()
			this.subElements = this.getSubElements(this.element);
			console.log(this)
			this.initEvents()
			return this.element
		});
	}

	async render () {

		return this.loadData()
	}

	getSelectCategories() {
		const isSelect = id => {
			if (this.product) {
				return this.product.subcategory === id ? 'selected' : ''
			}
			else {
				return ''
			}
		}

		return `
		<select class="form-control" id="subcategory" name="subcategory">
			${this.caterories.map(item => {
				return item.subcategories.map(sub => {
						return `<option ${isSelect(sub.id)} value="${item.id}">${item.title} &gt; ${sub.title}</option>`
					}).join('')
			}).join('')}
		</select>
		`
	}

	getValueInput(name, selectValue) {
		if ( this.product ) {

			if (name === 'status') {
				return this.product.status ===  selectValue ? 'selected' : ''
			}

			return this.product[name] ?? ''
		} else return ''
	}

	getImages(product = []) {
		if(product.images && product.images.length) {
			return product.images.map(item => {
				return `
					<li class="products-edit__imagelist-item sortable-list__item" style="">
						<input type="hidden" name="url" value="${item.url}">
						<input type="hidden" name="source" value="${item.source}">
						<span>
							<img src="icon-grab.svg" data-grab-handle="" alt="grab">
							<img class="sortable-table__cell-img" alt="Image" src="${item.url}">
							<span>${item.source}</span>
						</span>
						<button type="button">
							<img src="icon-trash.svg" data-delete-handle="" alt="delete">
						</button>
					</li>
				`
			}).join('')
		} else {
			return ``
		}	
	}

	getForm() {
		let div = document.createElement('div')
		div.innerHTML = `
		<div class="product-form">
			<form data-element="productForm" class="form-grid">
				<div class="form-group form-group__half_left">
					<fieldset>
						<label class="form-label">Название товара</label>
						<input id="title" value='${this.getValueInput('title')}' required="" type="text" name="title" class="form-control" placeholder="Название товара">
					</fieldset>
				</div>
				<div class="form-group form-group__wide">
					<label class="form-label">Описание</label>
					<textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${this.getValueInput('description')}</textarea>
				</div>
				<div class="form-group form-group__wide" data-element="sortable-list-container">
				<label class="form-label">Фото</label>
				<div data-element="imageListContainer">
					<ul class="sortable-list">
						${this.getImages(this.product)}
					</ul>
				</div>
					<button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
				</div>
				<div class="form-group form-group__half_left">
					<label class="form-label">Категория</label>
					${this.getSelectCategories()}
				</div>
				<div class="form-group form-group__half_left form-group__two-col">
					<fieldset>
						<label class="form-label">Цена ($)</label>
						<input id="price" value=${this.getValueInput('price')} required="" type="number" name="price" class="form-control" placeholder="100">
					</fieldset>
					<fieldset>
						<label class="form-label">Скидка ($)</label>
						<input id="discount" value=${this.getValueInput('discount')} required="" type="number" name="discount" class="form-control" placeholder="0">
					</fieldset>	
				</div>
				<div class="form-group form-group__part-half">
					<label class="form-label">Количество</label>
					<input id="quantity" value=${this.getValueInput('quantity')} required="" type="number" class="form-control" name="quantity" placeholder="1">
				</div>
				<div class="form-group form-group__part-half">
					<label class="form-label">Статус</label>
					<select id="status" class="form-control" name="status">
						<option ${this.getValueInput('name', 1)} value="1">Активен</option>
						<option ${this.getValueInput('name', 0)} value="0">Неактивен</option>
					</select>
				</div>
				<div class="form-buttons">
				<button type="submit" name="save" class="button-primary-outline">
					Сохранить товар
				</button>
			</div>
		</form>
		</div>
		`
		return div = div.firstElementChild
	}
	formSave(formdData){

	}

	loadForm = async e => {
		e.preventDefault()
		const productData = new FormData(this.subElements.productForm)
			productData.delete('url')
			productData.delete('source')
		// собираем данные
		const fetchBody = {}	
		for( const [key, value] of productData ) {
			fetchBody[key] = !isNaN(Number(value)) ? Number(value) : value
		}
		// собираем изображение
		fetchBody.images = []
		const images = this.subElements.imageListContainer.querySelectorAll('.products-edit__imagelist-item');
		if(images.length){
			[...images].reduce(((accum, img) => {
				const url = img.querySelector('[name=url]').value
				const source = img.querySelector('[name=source]').value
				accum.push({url: url, source: source})
				return accum
			}), fetchBody.images)
		}

		if(this.productId) {
			fetchBody.id = this.productId
			await this.loadProduct('', {
				method: 'PATCH',
				headers: {
					'content-type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(fetchBody)
			}).then(() => this.updated())
			
		} else {
			await this.loadProduct('', {
				method: 'PUT',
				headers: {
					'content-type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(fetchBody)
			}).then(() => this.save())
		}	
	}

	loadImageBtn = e => {

	}

	initEvents() {
		const saveBtn = this.element.querySelector('button[name="save"]'),
			loadImageBtn = this.element.querySelector('button[name="uploadImage"]');
		saveBtn.addEventListener('click', (e) => this.loadForm(e));
		loadImageBtn.addEventListener('click', (e) => this.loadImageBtn(e))

		const save = new CustomEvent('product-saved', {detail:'сработало событие product-saved'})
		this.save = () => this.element.dispatchEvent(save)
		const updated =  new CustomEvent('product-updated', {detail:'сработало событие product-updated'})
		this.updated = () => this.element.dispatchEvent(updated)

	}

	getSubElements(element) {
		const elements = element.querySelectorAll('[data-element]');

		return [...elements].reduce((accum, subElement) => {
			accum[subElement.dataset.element] = subElement;
			return accum;
		}, {});
	}

	destroy() {
		this.remove();
		this.subElements = {};
	}

	remove() {
		this.element.remove();
	}
}
