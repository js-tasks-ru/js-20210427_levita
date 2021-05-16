export default class NotificationMessage {
    constructor(message = '', 
    {
        duration = 2000,
        type = 'success'
    } = {}){
        this.message = message;
        this.duration = duration;
        this.type = type;
        this.render()
    }
    
    render() {
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="notification ${this.type}" style="--value:${this.duration/1000}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                </div>
            </div>
        `
        this.element = div.firstElementChild;
        console.log(this.element)
    }

    show(el) {
        this.__proto__.element ? this.__proto__.element.remove() : null;
        el = el ? el : document.body;
        el.append(this.element);
        setTimeout(() => {
            this.remove()
        }, this.duration);

        this.__proto__.element = this.element;
    }

    remove() {
        this.element.remove();
        this.__proto__.element ? this.__proto__.element.remove() : null
    }

    destroy() {
        this.element.remove();
        this.__proto__.element ? this.__proto__.element.remove() : null
    }
}
