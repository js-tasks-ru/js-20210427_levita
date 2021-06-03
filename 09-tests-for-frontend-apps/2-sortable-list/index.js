export default class SortableList {
    element = null;

    constructor(items = []) {
        this.items = [...items.items];
        this.render()
    }

    initListeners() {
        this.element.addEventListener('pointerdown', event => this.dragOn(event))
    }

    dragEnd = () => this.dragOff()
    moveAt = event => this.dragging(event)
    
    dragOn(event) {
        if(! event.target.closest('.sortable-list__item')) return
        if(event.target.hasAttribute('data-delete-handle')) {
            event.target.closest('.sortable-list__item').remove()
            return
        }

        this.dragElem = event.target.closest('.sortable-list__item');
        const elemWidth = this.dragElem.clientWidth
        const elemHeight = this.dragElem.clientHeight
        this.dragElem.style.width = elemWidth + 'px'
        this.dragElem.classList.add('sortable-list__item_dragging');
        let shiftX = event.clientX - this.dragElem.getBoundingClientRect().left;
        let shiftY = event.clientY - this.dragElem.getBoundingClientRect().top;
        this.padding = {shiftX, shiftY}
        this.dragElem.replaceWith(this.togglePlaceholder({elemWidth, elemHeight}))
        this.element.append(this.dragElem);
        this.dragging(event)
        this.element.style.cursor = 'grabbing'
        
        document.addEventListener('mouseup', this.dragEnd)
        document.addEventListener('mousemove', this.moveAt)
        
    }

    dragging(event) {
        this.dragElem.style.left = event.pageX - this.padding.shiftX + 'px';
        this.dragElem.style.top = event.pageY - this.padding.shiftY + 'px';
        const sortItem = event.target.closest('.sortable-list__item:not(.sortable-list__item_dragging)');

        if(sortItem) {
            this.replaceElem(sortItem)
        }
    }
    

    replaceElem(sortItem) {
        let cloneItem = sortItem.cloneNode(true);
        this.holder.replaceWith(cloneItem)
        sortItem.replaceWith(this.holder)
    }

    dragOff = () => {
        this.dragElem.classList.remove('sortable-list__item_dragging')
        this.dragElem.style.cssText = '';
        this.padding = 0 
        this.element.style.cursor = 'unset'
        
        this.holder.replaceWith(this.dragElem)
        this.holder.remove()
        this.holder = null
        document.removeEventListener('mouseup', this.dragEnd)
        document.removeEventListener('mousemove', this.moveAt)
    }

    togglePlaceholder(css) {
        const holder = document.createElement('div')
        holder.classList.add('sortable-list__placeholder')
        holder.style.width = css.elemWidth + 'px'
        holder.style.height = css.elemHeight + 'px'
        if (!this.holder) this.holder = holder
        return holder
    }

    render() {
        const ul = document.createElement('ul');
        ul.classList.add('sortable-list')
        this.items.map(item => {
            item.classList.add('sortable-list__item')
            ul.append(item);
        })
        this.element = ul;
        this.initListeners()
    }

    destroy() {
		this.remove();
		this.subElements = {};
	}

    remove() {
		this.element.remove();
	}
}
