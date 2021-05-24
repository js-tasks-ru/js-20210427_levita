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

        document.addEventListener('pointerover', this.onPointerOver, true);
        document.addEventListener('pointerout', this.clearTooltip);

    }
    onPointerOver = ev => {

        const element = ev.target.closest('[data-tooltip]');

        if (element) {
            this.render(element.dataset.tooltip);
            document.addEventListener('pointermove', this.moveTooltip);
        }

    }

    clearTooltip = () => {
        this.message = '';
        this.element.remove()
    }

    moveTooltip = ev =>  {
        const pageX = ev.clientX
        const pageY = ev.clientY
        this.element.style.top = `${pageY}px`
        this.element.style.left = `${pageX}px`
    }

    render(html) {
        this.element = document.createElement('div');
        this.element.className = 'tooltip';
        this.element.innerHTML = html;
        document.body.append(this.element);
    }


    initialize() {
        this.addListeners()
    }

    destroy() {
        this.element.remove()
        document.removeEventListener('pointerover', this.onPointerOver, true);
        document.removeEventListener('pointerout', this.clearTooltip);
        document.removeEventListener('pointermove', this.moveTooltip);
    }

}

export default Tooltip;
