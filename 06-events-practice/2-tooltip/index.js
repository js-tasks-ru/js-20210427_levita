class Tooltip {
    element = null;
    _instance = null
    constructor(message = '') {
        if(!Tooltip._instance)  Tooltip._instance = this;
        this.instance = this;
        this.message = message;
        this.render()

        return Tooltip._instance
    }

    addListeners(){
        const divs = document.querySelectorAll('[data-tooltip]');
        divs.forEach(item => {
            item.addEventListener('pointerover', ev => this.renderTextTooltip(ev))
            item.addEventListener('mousemove', ev => this.moveTooltip(ev))
            item.addEventListener('pointerout', ev => this.clearTooltip(ev))
        })
    }
    renderTextTooltip(ev) {
        this.message = ev.target.dataset.tooltip;
        this.element.textContent = this.message
        document.body.append(this.element)
    }

    clearTooltip() {
        this.message = '';
        this.element.remove()
    }
    moveTooltip(ev) {
        
        const pageX = ev.clientX
        const pageY = ev.clientY
        this.element.style.top = `${pageY}px`
        this.element.style.left = `${pageX}px`
    }

    render() {
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="tooltip">${this.message}</div>
        `
        this.element = div.firstElementChild;
    }
    initialize() {
        this.addListeners()
    }

    destroy() {
        this.element.remove()
    }

}

export default Tooltip;
