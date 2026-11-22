class FunFacts extends HTMLElement {
    connectedCallback() {
        this.render();
        let panelMode = 'shown';
        try {
            panelMode = localStorage.getItem('hw5-fact-panel-mode');
        } catch (error) {
            console.warn('The panel preference could not be recovered.');
        }
        if (panelMode === 'shown') {
            this.removeAttribute('disabled');
        } else if (panelMode === 'hidden') {
            this.setAttribute('disabled', '');
        } else {
            panelMode = 'shown';
            console.warn('Invalid panel mode.');
        }
        this.updateVisibility();
        this.attachEventListeners();
    }    

    render() {
        const heading = document.createElement('h2');
        heading.textContent = 'Fun Facts!'

        const message = document.createElement('p');
        message.id = 'message';
        message.textContent = 'Click to see a fun fact!';

        const buttonStorage = document.createElement('button-storage');
        const random = document.createElement('button');
        random.id = 'random-button'
        random.textContent = 'Random Fact';
        const today = document.createElement('button');
        today.id = 'today-button'
        today.textContent = 'Today\'s Fact';
        buttonStorage.appendChild(random);
        buttonStorage.appendChild(today);

        const status = document.createElement('p');
        status.setAttribute('role', 'status');
        status.id = 'status'
        status.textContent = 'Status: ';

        const body = document.createElement('fact-body');
        const frag = document.createDocumentFragment();
        frag.append(message, buttonStorage, status);
        body.appendChild(frag);

        frag.append(heading, body);
        this.appendChild(frag);
    }

    attachEventListeners() {
        const today = this.querySelector('#today-button');
        const random = this.querySelector('#random-button');

        today.addEventListener('click', async () => {
            message.textContent = await this.loadMessage('today');
        });

        random.addEventListener('click', async () => {
            message.textContent = await this.loadMessage('random');
        });
    }

    static get observedAttributes() {
        return ['disabled']
    }

    attributeChangedCallback(name) {
        if (name === 'disabled') {
            this.updateVisibility();
        }
    }

    updateVisibility() {
        const body = this.querySelector('fact-body');

        if (this.hasAttribute('disabled')) {
            body.style.display = 'none';
        } else {
            body.style.display = 'flex';
        }
    }

    async loadMessage(type) {
        const statusMessage = this.querySelector('#status');
        statusMessage.textContent = 'Status: Request Started';

        try {
            let response;
            if (type === 'random') {
                response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
            } else if (type === 'today') {
                response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/today?language=en');
            } else {
                throw new Error('Invalid type.')
            }
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();
            if (typeof data?.text !== 'string') {
                throw new Error('Expected a message in the response.');
            }
            statusMessage.textContent = 'Status: Request Successful';
            return data.text;
        } catch (error) {
            statusMessage.textContent = 'Status: Request Failed';
            console.error('Could not load the message.', error);
        }

    }
}

customElements.define('fun-facts', FunFacts);

const visibilityButton = document.querySelector('#fun-fact-toggle');
visibilityButton.style.display = 'block';

const funFacts = document.querySelector('fun-facts');

let minimized = false;
let panelMode = 'shown';
try {
    panelMode = localStorage.getItem('hw5-fact-panel-mode');
} catch (error) {
    console.warn('The panel preference could not be recovered.');
}
if (panelMode === 'shown') {
    minimized = false;
} else if (panelMode === 'hidden') {
    minimized = true;
} else {
    console.warn('Invalid panel mode.');
}


visibilityButton.addEventListener('click', () => {
    if (minimized) {
        minimized = false;
        try {
            localStorage.setItem('hw5-fact-panel-mode', 'shown');
        } catch (error) {
            console.warn('The panel preference could not be saved.');
        }
    } else {
        minimized = true;
        try {
            localStorage.setItem('hw5-fact-panel-mode', 'hidden');
        } catch (error) {
            console.warn('The panel preference could not be saved.');
        }
    }
    funFacts.toggleAttribute('disabled');
});