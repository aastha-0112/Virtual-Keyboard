const keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: " ",
        capslock: false
    },

    init() {
        // Creating main elements -
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        // setting up main elements -
        this.elements.main.classList.add("keyboard", "keyboard--hidden")
        this.elements.keysContainer.classList.add("kkeys")

        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".kkey")

        // Adding to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        //  Automatically use keyboard for elements with .use-keyboard-input

        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                })
            })
        })
    },

    _createKeys() {
        const fragment = document.createDocumentFragment()
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Function that creates html for icon -
        const createIconHTML = (icon_name) => {
            return `<i class = "material-icons" > ${icon_name} <i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement('button')
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) != -1;

            // Adding attributes/classes -
            keyElement.setAttribute("type", "button")
            keyElement.classList.add("kkey")

            switch (key) {
                case "backspace":
                    keyElement.classList.add("key--wide")
                    keyElement.innerHTML = createIconHTML("backspace")

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1)

                        this._triggerEvents("oninput")
                    })

                    break;

                case "caps":
                    keyElement.classList.add("key--wide", "key--activatable")
                    keyElement.innerHTML = createIconHTML("keyboard_capslock")

                    keyElement.addEventListener("click", () => {
                        this._toggleCapslock();

                        keyElement.classList.toggle("key--active", this.properties.capslock)
                    })

                    break;

                case "enter":
                    keyElement.classList.add("key--wide")
                    keyElement.innerHTML = createIconHTML("keyboard_return")

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";

                        this._triggerEvents("oninput")
                    })

                    break;

                case "space":
                    keyElement.classList.add("key-extra-wide")
                    keyElement.innerHTML = createIconHTML("space_bar")

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";

                        this._triggerEvents("oninput")
                    })

                    break;

                case "done":
                    keyElement.classList.add("key--wide", "key--dark")
                    keyElement.innerHTML = createIconHTML("check_circle")

                    keyElement.addEventListener("click", () => {
                        this.close();

                        this._triggerEvents("onclose")
                    })

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capslock ? key.toUpperCase() : key.toLowerCase();

                        this._triggerEvents("oninput")
                    });

                    break;

            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }

        });

        return fragment;
    },

    _triggerEvents(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapslock() {
        this.properties.capslock = !this.properties.capslock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capslock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || " ";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden")
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;

        this.elements.main.classList.add("keyboard--hidden")
    }
}

window.addEventListener("DOMContentLoaded", function() {
    keyboard.init();

});