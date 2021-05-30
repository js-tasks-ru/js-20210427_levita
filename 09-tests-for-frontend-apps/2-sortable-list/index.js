export default class SortableList {
    element = null;
    constructor(items = []) {
        this.items = [...items.items];
        this.render()
        console.log(this)
    }

    initListeners() {
        this.element.childNodes.forEach(item => {
            item.addEventListener('mousedown', event => this.dragOn(event) )
        })
    }
    
    dragOn(event) {
        const elem = event.currentTarget;
        elem.classList.add('sortable-list__item_dragging')
        elem.addEventListener('mouseup', this.dragOff)
    }

    dragOff = (event) => {
        const elem = event.currentTarget;
        console.log('s')
        elem.classList.remove('sortable-list__item_dragging')
        elem.removeEventListener('mouseup', this.dragOff)
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


}
