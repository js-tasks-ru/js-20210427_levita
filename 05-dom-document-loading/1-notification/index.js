export default class NotificationMessage {
    static enableElement;

    constructor(message = '', 
    {
        duration = 2000,
        type = 'success'
    } = {}){
        if (NotificationMessage.enableElement) {
            NotificationMessage.enableElement.remove();
          }
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
        NotificationMessage.enableElement = this.element;
    }

    show(el = document.body) {
        el.append(this.element);
        setTimeout(() => {
            this.remove()
        }, this.duration);
        
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove()
        this.element = null;
        NotificationMessage.enableElement = null;
    }
}
